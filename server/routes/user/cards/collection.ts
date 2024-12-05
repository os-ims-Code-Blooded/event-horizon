import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../../misc/types.ts';
import database from '../../../db/index.ts';

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
    console.error(`Error on GET request for all cards belonging to user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

// very intensive operation, checks user score to see if they have earned a card
collections.post('/:id', async (req: AuthRequest, res) => {

  try {

    // find the user's score
    const userScore = await database.user.findUnique({
      where: {
        id: Number(req.params.id)
      },
      select: {
        score: true
      }
    })

    // find the score required and the IDs of all cards
    const allCards = await database.cards.findMany({
      select: {
        score_required: true,
        id: true
      }
    })

    // if the user's score meets card recommendations, they should have these cards (array of card IDs)
    const earnedCards = allCards.reduce((accum, curr) => {
      if (curr.score_required <= userScore.score){
        accum.push(curr.id);
        return accum;
      } else {
        return accum;
      }
    }, [])

    // find all cards that the user has been assigned
    const userCards = await database.user_Cards.findMany({
      where: {
        user_id: Number(req.params.id)
      }
    })

    // the current cards that have been given to a user
    const userCurrentCards = userCards.map((card) => {
      return card.card_id;
    })

    // I have earned these cards, they are assigned to my account and me as a user [1, 2, 3, 4...]
    // I have TECHNICALLY earned these cards, but have not been given them yet [...5, 6, 7]
    // represents all cards that a user has earned, but has not been given
    const cardsToAdd = earnedCards.filter((card: number) => {
      if (!userCurrentCards.includes(card)) {
        return card;
      }
    });

    // if there are cards to add to the user
    if (cardsToAdd.length > 0){

      // we use a loop here because createMany cannot be used for relationships
      cardsToAdd.forEach( async (id) => {
        await database.user_Cards.create({
          data: {
            card: { connect: { id: Number(id) } },
            user: { connect: { id: Number(req.params.id) } }
          }
        })
      })

      res.sendStatus(201);
    } else {
      res.sendStatus(200);
    }

  } catch (error) {
    console.error(`Error on POST request creating a card for user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

export default collections;