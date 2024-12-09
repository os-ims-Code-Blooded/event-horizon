import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';
import errorHandler from '../../misc/errorHandler.ts';

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

      let userState = await database.game_Card_States.findMany({
        where: { round_id: findMostRecent }
      })

      const player = userState.reduce((accum, curr) => {
        if (curr.user_id === Number(req.params.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      const enemy = userState.reduce((accum, curr) => {
        if (curr.user_id !== Number(req.params.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      res.status(200).send({ 
        "Current Round": findMostRecent,
        "Current Deck": player.deck,
        "Current Hand": player.hand,
        "Enemy Deck": enemy.deck,
        "Enemy Hand": enemy.hand
      });

    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error fetching most recent round for game #${req.params.id}.`, error)
    res.sendStatus(500);
  }

})

export default rounds;