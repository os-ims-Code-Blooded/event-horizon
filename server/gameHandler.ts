import express, { Request, Response } from 'express';
import database from './db/index.ts';
import createAction from './routes/games/helpers/createAction.ts';
import calculateGameState from './routes/games/helpers/calculateGameState.ts';
import calculatePlayerState from './routes/games/helpers/calculatePlayerState.ts';
import generateResponse from './routes/games/helpers/generateResponse.ts';

export default async function gameHandler(req: any) {


  /*

  { 
    body: {
      "data": {
        "round_id": 1,
        "user_id": 1,
        "action": "FIRE" || "LOAD" || "BLOCK",
        "card_id": 1,
      }
    }
  }
  */

  try {

    // get the current Round and peripherals
    const currentRound = await database.rounds.findFirst({
      where: { id: Number(req.body.data.round_id)},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })

    // if this is the first action submitted for a round
    if (currentRound.Actions.length === 0){

      await createAction(req);
      console.log(`rounds.ts : 40 | Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`)
      return {
        "Successful": true,
        "Message": `Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`
      }

    // else if this is the second (and last) action submitted for a round
    } else if (currentRound.Actions.length > 0){

      // create the action for this user
      await createAction(req);
      console.log(`rounds.ts : 48 | Action #2 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`)

      // then attempt to perform calculations, and store the results
      const updateState = await calculateGameState(req, currentRound.game_id);

      console.log(`rounds.ts : 52 | Received calculations for Game #${currentRound.game_id} - Round #${currentRound.id}.`)
      console.log(updateState);

      // acquire the current player information
      let updatePlayers = currentRound.Round_Player_Info.slice();

      console.log(`rounds.ts : 58 | Copied player information for Game #${currentRound.game_id} - Round #${currentRound.id} for applying updates.`)
      console.log(updatePlayers);

      // end the current round
      await database.rounds.update({ 
        where: { id: req.body.data.round_id},
        data: { end_date: new Date() }
      })

      console.log(`rounds.ts : 64 | Added end date to Game #${currentRound.game_id} - Round #${currentRound.id}.`)

      // create a new round for the game only after all calculations have succeeded
      const newRound = await database.rounds.create({
        data: { game_id: currentRound.game_id}
      })

      console.log(`rounds.ts : 72 | New Round #${newRound.id} initialized for Game #${currentRound.game_id}.`)

      // returns an array of new players after updates
      updatePlayers = calculatePlayerState(updatePlayers, updateState, newRound.id);

      console.log(`rounds.ts : 79 | Attempting to calculate player state for Game #${newRound.game_id}; storing updated player information on new Round #${newRound.id}.`)
      console.log(updatePlayers);

      for (let i = 0; i < updatePlayers.length; i++){
        console.log(`rounds.ts : 84 | Attempting to create new player state for User #${updatePlayers[i].user_id} in Game #${newRound.game_id} - Round #${newRound.id}.`)
        const newPlayerInfo = await database.round_Player_Info.create({
          data: updatePlayers[i]
        })
        console.log(`rounds.ts : 86 | New player state for User #${updatePlayers[i].user_id}: `, newPlayerInfo);
      }

      const formattedResponse = await generateResponse(newRound.id, currentRound.id);
      console.log(`rounds.ts : 92 | Success on generation of response; sending response to client for Game Session #${newRound.game_id}.`);

      return (formattedResponse);

    }


  } catch (error) {
    console.error(`Fatal error encountered within Rounds router (rounds.ts), error message follows: `, error);
    return {
      "Success": false,
      "Message": `Error on client in processing turn submission.`
    }
  }

};