import express, { Request, Response } from 'express';
import database from '../../../db/index.ts';

const decks = express.Router();

// enables you to get all card decks for the specified user
// a specific deck can also be specified in req.body.data
decks.get('/:id', async (req, res) => {

  try {

    // if req.body.data exists
    if (req.body.data){

      // check to see if a deck_name was specified
      if (!req.body.data.deck_id){
        res.sendStatus(203);
      }

      // try to find that deck_name belonging to the user (req.params.id)
      const specificDeck = await database.user_Decks.findFirst({
        where: {
          AND: [
            {id: Number(req.body.data.deck_id)},
            {user_id: Number(req.params.id)}
          ]
        }
      })

      
      let cardsInDeck: any = await database.user_Deck_Cards.findMany({
        where: {
          deck_id: specificDeck.id
        }
      })

      cardsInDeck = cardsInDeck.map((card: any) => card.card_id)
      
      const verboseCards = await database.cards.findMany({
        where: {
          id: { in: cardsInDeck }
        }
      })

      const formattedResponse = {
        id: specificDeck.id,
        user_id: specificDeck.user_id,
        deck_name: specificDeck.deck_name,
        cards: verboseCards
      }

      if (!specificDeck){
        res.sendStatus(404);  // if none found, 404
      } else if (cardsInDeck.length === 0) {
        res.status(200).send(specificDeck); // if found, send
      } else {
        res.status(200).send(formattedResponse);
      }

    // if no specific deck requested
    } else {
      
      // try to get all decks belonging to user
      const userDecks = await database.user_Decks.findMany({
        where: {
          user_id: Number(req.params.id)
        }
      })
      
      if (userDecks.length === 0){
        res.sendStatus(404);  // if none found, 404
      } else {
        res.status(200).send(userDecks); // if found, send
      }
    }

  } catch (error) {
    console.error(`Error on GET card decks for user #${req.params.id}.`);
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
          card: {connect: {id: card}},
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
            card: {connect: {id: card}},
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

    if (!req.body.data){
      console.error(`Error on PATCH card deck for user #${req.params.id}; no 'data' with 'deck_id' property exists on request body.`)
      res.sendStatus(203);
    }    

    const removeCardsFromDeck = await database.user_Deck_Cards.deleteMany({
      where: {
        deck_id: Number(req.body.data.deck_id),
      }
    })

    const deleteDeck = await database.user_Decks.delete({
      where: {
        id: Number(req.body.data.deck_id)
      }
    })

    if (!deleteDeck) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }


  } catch (error) {
    console.error(`Error on DELETE card deck #${req.body.data.deck_id} for user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

export default decks;