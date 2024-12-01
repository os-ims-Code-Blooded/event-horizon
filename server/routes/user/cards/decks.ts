import express, { Request, Response } from 'express';
import database from '../../../db/index.ts';

const decks = express.Router();

// enables you to get all card decks for the specified user
// a specific deck can also be specified in req.body.data
decks.get('/:id', async (req, res) => {

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

decks.get('/specific/:id', async (req, res) => {

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

// you provide only a deck ID here because a deck is specifically unique to a user (no user ID necessary)
decks.get('/specific/:id', async (req, res) => {

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
  } catch(error){
    res.sendStatus(500);
  }

})

decks.get('/selected-deck/:id', async (req, res) => {

  try {

    const findUserDeck = await database.user.findFirst({
      where: { id: Number(req.params.id)},
      include: {
        selectedDeck: { include: {
          User_Decks_Cards: true
        }}
      }
    })

    if (!findUserDeck){
      res.sendStatus(404);
    } else {
      res.status(200).send(findUserDeck.selectedDeck);

    }

  } catch (error) {
    console.error(`Error on GET card decks for user #${req.params.id}.`, error);
    res.sendStatus(500);
  }

})


// enables you to create a new card deck, this only creates the NAME for the card deck
// this gets somewhat complex, so I am including an example inside of this endpoint
decks.post('/:id', async (req, res) => {

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
decks.patch('/:id', async (req, res) => {

  /* Example POST request format
  ==================================================================================================
  req: {
    body: {               // !!! MUST CHOOSE AT LEAST ONE OPTION OR WILL ENCOUNTER ERROR !!!
      data: {
        deck_id:          // REQUIRED: Deck ID that you want to update
        deck_name:        // OPTION: This is the name for the current deck, REQUIRES deck_id too
        delete_cards:     // OPTION: This is an ARRAY of ONLY card IDs that the user wants to delete
        add_cards:        // OPTION: This is an ARRAY of ONLY card IDs that the user wants to delete
      }
    }
  }
  ==================================================================================================
  */
  console.log('req.delete_cards', req.body.data.remove_cards);

  try {

    if (!req.body.data){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'data' property on request body.`)
      res.sendStatus(203);
    } else if (!req.body.data.deck_id){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'deck_id' property exists for updating a deck.`)
      res.sendStatus(203);
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
      const safetyCheck = req.body.data.delete_cards.map((card:any) => Number(card));

      await database.user_Deck_Cards.deleteMany({
        where: {
          card_id: { in: safetyCheck},
          deck_id: Number(req.body.data.deck_id)
        }
      })
    }

    if (req.body.data.add_cards){
      const safetyCheck = req.body.data.add_cards.map((card:any) => Number(card));

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
    console.error(`Error on PATCH card deck '${req.body.data.deck_name}' for user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

// enables you to delete an existing card deck
decks.delete('/:id', async (req, res) => {

  try {

    const deleteDeck = await database.user_Decks.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    if (!deleteDeck) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }


  } catch (error) {
    console.error(`Error on DELETE card deck #${req.params.id}.`);
    res.sendStatus(500);
  }

})

export default decks;