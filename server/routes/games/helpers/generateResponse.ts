import database from "../../../db/index.ts";
import reviewWinConditions from "./reviewWinConditions.ts";

export default async function generateResponse(newRound: number, prevRound: number) {

  try {

    const newInfo = await database.rounds.findFirst({
      where: { id: newRound},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })

    const isResolved = reviewWinConditions(newInfo.Round_Player_Info);
    let gameOver = null;

    if (isResolved) {

      gameOver = await database.games.update({
        where: { id: newInfo.game_id},
        data: { victor: { connect: { id: isResolved} } }
      });

      await database.rounds.update({
        where: { id: newRound},
        data: { end_date: new Date() }
      })

    }

    const prevInfo = await database.rounds.findFirst({
      where: { id: prevRound},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })

    if (gameOver) {
      return {
        GameComplete: gameOver,
        Current: newInfo,
        Previous: prevInfo
      }
    } else {
      return {
        Current: newInfo,
        Previous: prevInfo
      }
    }


  } catch (error) {
    throw new Error(`Failure to generate response for client.`)
  }

}