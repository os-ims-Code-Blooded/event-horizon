import database from "../database/index.ts";
import reviewWinConditions from "./reviewWinConditions.ts";

export default async function generateResponse(newRound: number, prevRound: number) {

  try {

    const newInfo = await database.rounds.findFirst({
      where: { id: newRound},
      include: {
        round_effects: true,
        game_player_information: true,
        actions: true,
        actions_loaded: true,
        game_card_states: true
      }
    })

    const isResolved = await reviewWinConditions(newInfo.game_player_information, newInfo.game_id);
    let gameOver = null;

    if (isResolved) {

      gameOver = await database.games.update({
        where: { id: newInfo.game_id},
        data: { 
          victor: { connect: { id: isResolved}},
          end_date: new Date(),
          status: false
        } 
      });

      // if the game was private, delete that invite from our records
      if (gameOver.private) {
        await database.game_invites.deleteMany({
          where: { game_id: gameOver.id}
        })
      }

      await database.rounds.update({
        where: { id: newRound},
        data: { end_date: new Date() }
      })

    }

    const prevInfo = await database.rounds.findFirst({
      where: { id: prevRound},
      include: {
        round_effects: true,
        game_player_information: true,
        actions: true,
        actions_loaded: true,
        game_card_states: true
      }
    })

    if (gameOver) {
      return {
        Success: true,
        GameComplete: gameOver,
        Current: newInfo,
        Previous: prevInfo
      }
    } else {

      return {
        Success: true,
        Current: newInfo,
        Previous: prevInfo
      }
    }


  } catch (error) {
    throw new Error(error);
  }

}