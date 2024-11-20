import express, { Request, Response } from 'express';
import database from '../../db/index.ts';

const cards = express.Router();

cards.get('/', async (req, res) => {

  try {

    const cards = await database.cards.findMany();

    if (!cards) {
      res.sendStatus(404);
    } else {
      res.status(200).send(cards);
    }

  } catch (error) {
    console.error(`Error on accessing administrative repository containing all cards.`)
    res.sendStatus(500);
  }

})

export default cards;