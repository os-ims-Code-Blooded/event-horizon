import database from "../../database";
import errorHandler from "./error_logging/errorHandler";

export default async function closeStagnantGames() {
  
    try {
      
      let timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - 5);
  
  
      // attempt to find all open rounds that are older than 5 minutes
      let stagnantGames = await database.rounds.findMany({
        where: {
          AND: [
            { end_date: null },
            { start_date: { lte: timestamp} },
          ]
        },
        include: {
          Actions: true
        }
      })
  
      // filter all games to find those with less than 2 actions on a round
      stagnantGames = stagnantGames.filter((game) => game.Actions.length === 1)

      const updates = [];
      
      for (let i = 0; i < stagnantGames.length; i++) {

        await database.rounds.update({
          where: { id: stagnantGames[i].id},
          data: { end_date: new Date()}
        })
  
        // find the victor (whoever is waiting for a response)
        const victor = stagnantGames[i].Actions[0].user_id;
  
        // set the victor and end the game
        const gameOver = await database.games.update({
          where: { id: stagnantGames[i].game_id},
          data: {
            victor: { connect: { id: victor}},
            end_date: new Date(),
            status: false
          }
        })

        // figure out how many rounds were played for calculations
        const numberOfRounds = await database.rounds.findMany({
          where: { game_id: stagnantGames[i].game_id}
        })

        // find the opponent's information for update
        let opponent = await database.user_Games.findFirst({
          where: {
            NOT: [
              {user_id: victor},
            ],
            AND: [
              {game_id: stagnantGames[i].game_id}
            ]
          },
          select: {
            user_id: true
          }
        })

        // update the victor
        await database.user.update({
          where: { id: victor},
          data: {
            wins: { increment: 1},
            score: { increment: 10 * numberOfRounds.length}
          }
        })

        // update the opponent
        await database.user.update({
          where: { id: opponent.user_id},
          data: {
            losses: { increment: 1},
            score: { increment: 6 * numberOfRounds.length}
          }
        })

        updates.push(gameOver);
  
      }

      console.log(`Routine game maintenance: closed ${stagnantGames.length} stagnant games in database at ${new Date()}.`)
      return updates;

    } catch (error) {
      errorHandler(error);
      console.error(`Error on force closure of stagnant games: `, error);
    }
}
