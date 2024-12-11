import database from "../database/index.ts";
import updateCardsOnWin from "./updateCardsOnWin.ts";

export default async function reviewWinConditions(players: any, gameID: number) {

  try {
    
    let victor = null;

    let userOneHealth = players[0].health;
    let userTwoHealth = players[1].health;

    // if player two reduced player one's health to 0
    if (userOneHealth <= 0 && userTwoHealth > 0) {

      victor = players[1].user_id;

      const totalRounds = await database.rounds.findMany({
        where: { game_id: gameID }
      })

      let roundCount = totalRounds.length;

      await database.user.update({
        where: { id: players[0].user_id},
        data: { 
          losses: { increment: 1},
          score: { increment: (roundCount * 6)}
        }
      })

      await database.user.update({
        where: { id: players[1].user_id},
        data: { 
          wins: { increment: 1},
          score: { increment: (roundCount * 10)}
        }
      })

      await updateCardsOnWin(players[0].user_id);
      await updateCardsOnWin(players[1].user_id);

    // if player one reduced player two's health to 0
    } else if (userTwoHealth <= 0 && userOneHealth > 0) {

      victor = players[0].user_id;

      const totalRounds = await database.rounds.findMany({
        where: { game_id: gameID }
      })

      let roundCount = totalRounds.length;

      await database.user.update({
        where: { id: players[0].user_id},
        data: {
          wins: { increment: 1}, 
          score: { increment: (roundCount * 10)}
        }
      })

      await database.user.update({
        where: { id: players[1].user_id},
        data: { 
          losses: { increment: 1},
          score: { increment: (roundCount * 6)}
        }
      })

      await updateCardsOnWin(players[0].user_id);
      await updateCardsOnWin(players[1].user_id);

    // if both player's health is below 0
    } else if (userTwoHealth <= 0 && userOneHealth <= 0) {

      victor = (userTwoHealth > userOneHealth) ? players[1].user_id : players[0].user_id;

      const totalRounds = await database.rounds.findMany({
        where: { game_id: gameID }
      })

      let roundCount = totalRounds.length;


      if (victor === players[0].user_id) {
        await database.user.update({
          where: { id: players[0].user_id},
          data: {
            wins: { increment: 1}, 
            score: { increment: (roundCount * 10)}
          }
        })
  
        await database.user.update({
          where: { id: players[1].user_id},
          data: { 
            losses: { increment: 1},
            score: { increment: (roundCount * 6)}
          }
        })
      } else if (victor === players[1].user_id) {
        await database.user.update({
          where: { id: players[0].user_id},
          data: { 
            losses: { increment: 1},
            score: { increment: (roundCount * 6)}
          }
        })
  
        await database.user.update({
          where: { id: players[1].user_id},
          data: {
            wins: { increment: 1}, 
            score: { increment: (roundCount * 10)}
          }
        })
      }

      await updateCardsOnWin(players[0].user_id);
      await updateCardsOnWin(players[1].user_id);
    }

    return victor;

  } catch (error) {
    throw new Error(error);
  }

}