import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';
import errorHandler from '../../misc/errorHandler.ts';

const cards = express.Router();

cards.get('/', async (req: AuthRequest, res) => {

  try {

    const cards = await database.cards.findMany();

    if (!cards) {
      res.sendStatus(404);
    } else {
      res.status(200).send(cards);
    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on accessing administrative repository containing all cards.`)
    res.sendStatus(500);
  }

})

export default cards;