import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../../misc/types.ts';
import database from '../../../db/index.ts';

const decks = express.Router();

// enables you to get all card decks for the specified user
// a specific deck can also be specified in req.body.data
decks.get('/:id', async (req: AuthRequest, res) => {

  try {

    const allDecksAndCards = await database.user_Decks.findMany({
      where: { user_id: Number(req.params.id) }
    })
    
    if (!allDecksAndCards) {
      res.sendStatus(404);

    } else {
      res.status(200).send(allDecksAndCards);
    }

  } catch (error) {
    console.error(`Error on GET card decks for user #${req.params.id}.`, error);
    res.sendStatus(500);
  }

})

// you provide only a deck ID here because a deck is specifically unique to a user (no user ID necessary)
decks.get('/specific/:id', async (req: AuthRequest, res) => {

  try {

    const specificDeck = await database.user_Decks.findFirst({
      where: { id: Number(req.params.id) },
      include: { User_Decks_Cards: true}
    })
    
    if (!specificDeck) {
      res.sendStatus(404);
    } else {
      res.status(200).send(specificDeck.User_Decks_Cards);

    }

  } catch (error) {
    console.error(`Error on GET card decks for user #${req.params.id}.`, error);
    res.sendStatus(500);
  }

})

// enables you to create a new card deck, this only creates the NAME for the card deck
// this gets somewhat complex, so I am including an example inside of this endpoint
decks.post('/:id', async (req: AuthRequest, res) => {

  /* Example POST request format
  ===========================================================================================
  req: {
    body: {
      data: {
        deck_name: // REQUIRED: This is the name for the current deck
        cards:     // REQUIRED: This is an ARRAY of ONLY card IDs that the user wants to add
      }
    }
  }
  ==========================================================================================
  */

  try {

    if (!req.body.data){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'data' property exists on request body.`)
      res.sendStatus(203);
    } else if (!req.body.data.deck_name){
      console.error(`Error on PATCH card deck for user #${req.params.id}; 'data' property does not include a 'deck_name' property.`)
      res.sendStatus(203);
    } else if (!req.body.data.cards){
      console.error(`Error on PATCH card deck for user #${req.params.id}; 'data' property does not include a 'cards' property.`)
      res.sendStatus(203);
    }

    // creates the actual card deck for a user
    const createDeck = await database.user_Decks.create({
      data: {
        deck_name: req.body.data.deck_name,
        user_id: Number(req.params.id)
      }
    })

    // attempts to convert any ID (if string provided by accident) to a number
    const safetyCheck = req.body.data.cards.map((card: any) => {
      return Number(card);
    })

    safetyCheck.forEach( async (card: number) => {
      await database.user_Deck_Cards.create({
        data: {
          userCards: {connect: {id: card}},
          deck: {connect: {id: createDeck.id}}
        }
      })
    })

    res.sendStatus(201);

  } catch (error) {
    console.error(`Error on POST card deck '${req.body.data.deck_name}' for user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

// enables you to update an existing card deck
decks.patch('/:id', async (req: AuthRequest, res) => {

  try {

    if (!req.body.data){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'data' property on request body.`)
      res.sendStatus(203);
    } else if (!req.body.data.deck_id){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'deck_id' property exists for updating a deck.`)
      res.sendStatus(203);
    } else {
      const options = [
        'deck_id',
        'deck_name',
        "delete_cards",
        "add_cards"
      ]
  
      if (!req.body.data){
        res.sendStatus(203);
      } else {
        const reqOptions = Object.keys(req.body.data);
        let hasValidOption = false;
  
        reqOptions.forEach((option) => {
          if (options.includes(option)){
            hasValidOption = true;
          }
        })
  
        if (!hasValidOption){
          console.error(`No valid options provided for PATCH request to settings for user #${req.params.id}.`)
          res.sendStatus(203);
        }
      }
    }

    // if we have specified that we want to update a deck's name, update the deck name
    if (req.body.data.deck_name){
      await database.user_Decks.update({
        where: {
          user_id: Number(req.params.id),
          id: Number(req.body.data.deck_id)
        },
        data: {
          deck_name: req.body.data.deck_name
        }
      })
    }

    // if we have specified cards to remove for a deck, remove those associations
    if (req.body.data.delete_cards){

      // convert all card IDs supplied for deletion to numbers for database safety
      const safetyCheck = req.body.data.delete_cards.map((card:any) => Number(card));

      // pull all cards for the deck we are modifying
      const validationPull = await database.user_Deck_Cards.findMany({
        where: { deck_id: Number(req.body.data.deck_id) },
        select: { card_id: true }
      })

      // create an array of only the card IDs from the previous pull
      let validationCheck = validationPull.map((card:any) => card.card_id);

      validationCheck = validationCheck.reduce((accum, curr) => {
        // if the deck includes the card that we are deleting
        if (safetyCheck.includes(curr)){
          accum.push(curr);
          return accum;
        } else {
          return accum;
        }
      }, [])

      await database.user_Deck_Cards.deleteMany({
        where: {
          card_id: { in: validationCheck},
          deck_id: Number(req.body.data.deck_id)
        }
      })
    }

    if (req.body.data.add_cards){
      // convert all card IDs supplied for adding to deck to numbers for database safety
      let safetyCheck = req.body.data.add_cards.map((card:any) => Number(card));

      // pull all cards for the deck we are modifying
      const validationPull = await database.user_Deck_Cards.findMany({
        where: { deck_id: Number(req.body.data.deck_id) },
        select: { card_id: true }
      })

      // create an array of only the card IDs from the previous pull
      let validationCheck = validationPull.map((card:any) => card.card_id);
      console.log("***VALIDATION CHECK***", validationCheck)
      safetyCheck = safetyCheck.reduce((accum: any, curr: any) => {
        // if the deck does not include the card that we are deleting
        if (!validationCheck.includes(curr)){
          accum.push(curr);
          return accum;
        } else {
          return accum;
        }
      }, [])

      safetyCheck.forEach( async (card: number) => {
        await database.user_Deck_Cards.create({
          data: {
            userCards: {connect: {id: card}},
            deck: {connect: {id: Number(req.body.data.deck_id)}}
          }
        })
      }) 
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(`Error on PATCH card deck '${req.body.data.deck_name}' for user #${req.params.id}.`, error);
    res.sendStatus(500);
  }

})

// enables you to delete an existing card deck
decks.delete('/:id', async (req: AuthRequest, res) => {

  try {

    const deleteDeck = await database.user_Decks.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    res.sendStatus(204);

  } catch (error) {
    console.error(`Error on DELETE card deck #${req.params.id}.`);
    res.sendStatus(500);
  }

})

export default decks;