import express, { Request, Response } from 'express';
import database from '../../db/index.ts';

const rounds = express.Router();

// in this case, the Game Session ID is what is provided
rounds.get('/:id', async (req, res) => {

  try {

    // to get the current round for the game

  } catch (error) {

  }

})

export default rounds;


/*

  when there is a request for a round

  if no rounds associated with the game at all
    create a new round
    return that round

  if a round does exist
    check to see if two Round_Action records (Round_Action.length > 1) exist for the Round
    if so, return a new object and create a new round
      new object
        {
          newRound: id
          prevRound: {
            id:
            data for what happened...
          }
        }

    if not two Round_Action records, find the current round that this was submitted for
      create a new Round_Action

*/

/*

*/