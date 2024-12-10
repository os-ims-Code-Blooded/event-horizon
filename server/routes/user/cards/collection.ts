import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../../helpers/misc/types.ts';
import database from '../../../database/index.ts';
import errorHandler from '../../../helpers/misc/error_logging/errorHandler.ts';

const collections = express.Router();

// get cards that belong to a specific user
collections.get('/:id', async (req: AuthRequest, res) => {

  try {
    
    const cards = await database.user_Cards.findMany({
      where: { user_id: Number(req.params.id) }
    })

    if (!cards){
      res.sendStatus(404);
    } else {
      res.status(200).send(cards);
    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on GET request for all cards belonging to user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

// very intensive operation, checks user score to see if they have earned a card
collections.post('/:id', async (req: AuthRequest, res) => {

  try {

    // find the user's score and their current cards
    const user = await database.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { User_Cards: true }
    })

    // find cards where the score required is less than or equal to user score
    const allCards = await database.cards.findMany({
      where: { score_required: { lte: user.score }}
    })

    // if the user's score meets card recommendations, they should have these cards (array of card IDs)
    const earnedCards = allCards.map((card) => card.id)

    // the current cards that have been given to a user
    const userCurrentCards = user.User_Cards.map((card) => card.card_id)

    // I have earned these cards, they are assigned to my account and me as a user [1, 2, 3, 4...]
    // I have TECHNICALLY earned these cards, but have not been given them yet [...5, 6, 7]
    // represents all cards that a user has earned, but has not been given
    const cardsToAdd = earnedCards.filter((card: number) => !userCurrentCards.includes(card));

    // if there are cards to add to the user
    if (cardsToAdd.length > 0){

      const local = [];

      for (let i = 0; i < cardsToAdd.length; i++) {
        local.push(database.user_Cards.create({
          data: {
            card: { connect: { id: Number(cardsToAdd[i]) } },
            user: { connect: { id: Number(req.params.id) } }
          }
        }))
      }

      Promise.race(local)
        .then(() => {
          res.sendStatus(201);
        })
        .catch((error) => {
          console.error(`Error resolving promises in card collections update for user ${req.params.id}.`)
        })

      return; 

    } else {
      res.sendStatus(200);
    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on POST request creating a card for user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

export default collections;