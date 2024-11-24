import express, { Request, Response } from 'express';
import database from '../../db/index.ts';
import createAction from './helpers/createAction.ts';
import calculateGameState from './helpers/calculateGameState.ts';
import calculatePlayerState from './helpers/calculatePlayerState.ts';
import generateResponse from './helpers/generateResponse.ts';

const rounds = express.Router();

/*
req.body = 
{
 "data": {
  "round_id": 1,
  "user_id": 1,
  "action": "FIRE" || "LOAD" || "BLOCK",
  "card_id": 1,
 }
}
*/

rounds.post('/', async (req, res) => {

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
      res.sendStatus(201);

    // else if this is the second (and last) action submitted for a round
    } else if (currentRound.Actions.length > 0){

      // create the action for this user
      await createAction(req);

      // then attempt to perform calculations, and store the results
      const updateState = await calculateGameState(req, currentRound.game_id);

      // acquire the current player information
      let updatePlayers = currentRound.Round_Player_Info.slice();

      // end the current round
      await database.rounds.update({ 
        where: { id: req.body.data.round_id},
        data: { end_date: new Date() }
      })

      // create a new round for the game only after all calculations have succeeded
      const newRound = await database.rounds.create({
        data: { game_id: currentRound.game_id}
      })

      // returns an array of new players after updates
      updatePlayers = await calculatePlayerState(updatePlayers, updateState, newRound.id);

      for (let i = 0; i < updatePlayers.length; i++){
        await database.round_Player_Info.create({
          data: updatePlayers[i]
        })
      }

      const formattedResponse = await generateResponse(newRound.id, currentRound.id);

      res.status(201).send(formattedResponse);

    }


  } catch (error) {
    console.error(`Shit's fucked yo`, error);
    res.sendStatus(500);
  }

});

export default rounds;