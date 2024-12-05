import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';

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

rounds.get('/:id', async (req: AuthRequest, res) => {

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


// used to get the most recent action for a round
rounds.get('action/:id', async (req: AuthRequest, res) => {

})

export default rounds;