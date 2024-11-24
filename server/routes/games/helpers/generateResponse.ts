import database from "../../../db/index.ts";

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

    const prevInfo = await database.rounds.findFirst({
      where: { id: prevRound},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })

    return {
      Current: newInfo,
      Previous: prevInfo
    }

  } catch (error) {
    throw new Error(`Failure to generate response for client.`)
  }

}