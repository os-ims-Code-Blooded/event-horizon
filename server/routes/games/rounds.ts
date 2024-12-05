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

rounds.get('/:id', async (req, res) => {

  try {

    let findGameRounds = await database.rounds.findMany({
      where: { game_id: Number(req.params.id)}
    })

    if (findGameRounds.length === 0) {
      console.error(`No round currently exists for game #${req.params.id}.`)
      res.sendStatus(404);
      return;
    } else {
      
      let findMostRecent = findGameRounds.reduce( (accum, curr) => {
        if (curr.id > accum){
          return curr.id;
        } else {
          return accum;
        }
      }, 0)

      res.status(200).send({ "Current Round": findMostRecent});

    }

  } catch (error) {

    console.error(`Error fetching most recent round for game #${req.params.id}.`)
    res.sendStatus(500);

  }

})

export default rounds;