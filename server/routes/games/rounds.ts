import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../helpers/misc/types.ts';
import database from '../../database/index.ts';
import errorHandler from '../../helpers/misc/error_logging/errorHandler.ts';

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
      
      interface round {
        id: number;
        actual: number;
        game_id: number;
        start_date: Date;
        end_date: Date | null;
      }

      let findMostRecent: round = findGameRounds.reduce( (accum: any, curr: any) => {
        if (curr.id > accum.id){
          return curr;
        } else {
          return accum;
        }
      }, {id: 0})

      let userState = await database.game_Card_States.findMany({
        where: { round_id: findMostRecent.id }
      })

      const player = userState.reduce((accum, curr) => {
        if (curr.user_id === Number(req.user.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      const enemy = userState.reduce((accum, curr) => {
        if (curr.user_id !== Number(req.user.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      if (enemy) {
        res.status(200).send({ 
          "Current Round Actual": findMostRecent.actual,
          "Current Round": findMostRecent.id,
          "Current Deck": player.deck,
          "Current Hand": player.hand
        });        
      } else {
        res.status(200).send({ 
          "Current Round Actual": findMostRecent.actual,
          "Current Round": findMostRecent.id,
          "Current Deck": player.deck,
          "Current Hand": player.hand,
          "Enemy Deck": enemy.deck,
          "Enemy Hand": enemy.hand
        });
      }

    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error fetching most recent round for game #${req.params.id}.`, error)
    res.sendStatus(500);
  }

})

export default rounds;