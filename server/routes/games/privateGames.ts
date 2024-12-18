import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../helpers/misc/types.ts';
import database from '../../database/index.ts';
import shuffle from '../../helpers/shuffle.ts';
import errorHandler from '../../helpers/misc/error_logging/errorHandler.ts';

const privateGames = express.Router();

// This is used in SelectGame.tsx to render your private game invites
// this gets all game invites available for the current user
privateGames.get('/invites', async (req: AuthRequest, res) => {

  try {

    // find all the game invites that exist for the user
    // these will be displayed so that the user can click 'Join Game' to join a game
    // they each have a game_id property that is used in the POST request to join the game
    const existingInvites = await database.game_invites.findMany({
      where: {
        OR: [
          {from: req.user.id},
          {to: req.user.id}
        ]
      },
      include: {
        invitee: {
          select: {
            name: true
          }
        },
        invitedTo: {
          select: {
            name: true
          }
        },
      }
    })

    if (!existingInvites) {
      res.sendStatus(404);
    } else {

      // we return an object containing pre-sorted accepted and pending invites
      const invites: any = {
        "Accepted": existingInvites.filter((invite) => invite.accepted === true),
        "Pending": existingInvites.filter((invite) => invite.accepted === false)
      }

      res.status(200).send(invites);
    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on GET request for an open game associated with user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

// in this case, we provide the game_id (included on the invite) for the invite we are refusing
privateGames.delete('/invites/:id', async (req: AuthRequest, res) => {

  try {

    // deletes the invite from records
    const deleteInvite = await database.game_invites.deleteMany({
      where: { game_id: Number(req.params.id)}
    })

    // also deletes the game that was initialized for the invite (also cascading deletes)
    const deleteGameIfExists = await database.games.deleteMany({
      where: { id: Number(req.params.id)}
    })

    res.sendStatus(200);

  } catch (error) {
    errorHandler(error);
    console.error(`Error on request to refuse invite for player #${req.user.id}.`)
  }

})

// This is used in SelectGame.tsx to join a game
// client will submit a game_id that is provided by the get '/invites' route above to join
// if game is found (should always be found with our implementation) then return relevant data
// if the invite had not been previously accepted, then we initialize data
privateGames.post('/join/:id', async (req: AuthRequest, res) => {

  try {

    const alreadyJoined = await database.private_connections.findFirst({
      where: {
        AND: [
          { game_id: Number(req.params.id) },
          { user_id: req.user.id }
        ]
      }
    })

    if (alreadyJoined) {

      // find all of the game rounds
      let findGameRounds = await database.rounds.findMany({
        where: { game_id: Number(req.params.id)}
      })
  
      // if no rounds, then this is a server error
      if (findGameRounds.length === 0) {
        console.error(`No round currently exists for game #${req.params.id}.`)
        res.sendStatus(404);
        return;
      
      // otherwise, we have found the found
      } else {
        
        interface round {
          id: number;
          actual: number;
          game_id: number;
          start_date: Date;
          end_date: Date | null;
        }
  
        // we figure out which round is the most recent
        let findMostRecent: round = findGameRounds.reduce( (accum: any, curr: any) => {
          if (curr.id > accum.id){
            return curr;
          } else {
            return accum;
          }
        }, {id: 0})
  
        // we find the current state of their card deck
        let userState = await database.game_card_states.findMany({
          where: { round_id: findMostRecent.id }
        })
  
        // we also find their information
        const player = userState.reduce((accum, curr) => {
          if (curr.user_id === Number(req.user.id)) {
            return curr;
          } else {
            return accum;
          }
        }, null)
  
        // we also find their most recent player information
        const enemy = userState.reduce((accum, curr) => {
          if (curr.user_id !== Number(req.user.id)) {
            return curr;
          } else {
            return accum;
          }
        }, null)
  
        if (!enemy) {
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

    } else {

      // indicate that the invite has been accepted
      await database.game_invites.updateMany({
        where: {
          game_id: Number(req.params.id)
        }, 
        data: {
          accepted: true
        }
      })

      const user = await database.user.findFirst({
        where: { id: req.user.id }
      })

      // create the game connection
      const addUserToGame = await database.private_connections.create({
        data: {
          user_id: req.user.id,
          game_id: Number(req.params.id)
        }
      })

      const startingRound = await database.rounds.findFirst({
        where: { game_id: addUserToGame.game_id }
      })

      const initPlayerInfo = await database.game_player_information.create({
        data: { 
          round: { connect: { id: startingRound.id}},
          user: { connect: { id: user.id} }
        }
      })

      // find the cards in that deck
      const getPlayerDeckCards = await database.user_deck_cards.findMany({
        where: { deck_id: user.selectedDeckId },
        include: {
          userCards: true
        }
      })

      const mapCards = getPlayerDeckCards.map((deckCard) => {
        return deckCard.userCards;
      }).flat();

      let startingDeck; 
      let startingHand;
      
      if (getPlayerDeckCards.length <= 3) {
        startingDeck = [];
        startingHand = shuffle(mapCards);
      } else {
        startingDeck = shuffle(mapCards);
        startingHand = startingDeck.splice(0, 3);
      }

      // create them as a state to be used throughout game
      const makePlayerDeckState = await database.game_card_states.create({
        data: {
          round: { connect: { id: startingRound.id} },
          user: { connect: { id: user.id } },
          deck: startingDeck,
          hand: startingHand
        }
      })


      interface round {
        id: number;
        actual: number;
        game_id: number;
        start_date: Date;
        end_date: Date | null;
      }

      // we find the current state of their card deck
      let userState = await database.game_card_states.findMany({
        where: { round_id: startingRound.id }
      })

      // we also find their information
      const player = userState.reduce((accum, curr) => {
        if (curr.user_id === Number(req.user.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      // we also find their most recent player information
      const enemy = userState.reduce((accum, curr) => {
        if (curr.user_id !== Number(req.user.id)) {
          return curr;
        } else {
          return accum;
        }
      }, null)

      if (!enemy) {
        res.status(200).send({ 
          "Current Round Actual": startingRound.actual,
          "Current Round": startingRound.id,
          "Current Deck": player.deck,
          "Current Hand": player.hand
        });        
      } else {
        res.status(200).send({ 
          "Current Round Actual": startingRound.actual,
          "Current Round": startingRound.id,
          "Current Deck": player.deck,
          "Current Hand": player.hand,
          "Enemy Deck": enemy.deck,
          "Enemy Hand": enemy.hand
        });
      }

    }
    

  } catch (error) {
    errorHandler(error);
    console.error(`Error on request to add user #${req.body.user_id} to a private game session.`)
    console.error(error);
    res.sendStatus(500);
  }

})

// This is used in Friends.tsx to invite a friend to a game
// the ID provided here is the user that we intend to invite to the game
privateGames.post('/create/:id', async (req: AuthRequest, res) => {
  try {

    // checks to see if this person has already invited the player
    // ! might need to add a check here if the invite has been accepted
    // ! in gameHandler, check if game is private, if so then delete invite at end
    const inviteAlreadyExists = await database.game_invites.findFirst({
      where: {
        AND: [
          { from: req.user.id || Number(req.params.id)},
          { to: Number(req.params.id) || req.user.id},
        ]
      }
    })


    // if they have already invited the user, then this is invalid request
    if (inviteAlreadyExists) {
      console.error(`Error, user #${req.user.id} has already invited #${req.params.id} to a game.`)
      res.sendStatus(400);
      return;
    }

    const user = await database.user.findFirst({
      where: { id: req.user.id }
    })

    // else create a new private game
    const newGame = await database.games.create({
      data: { private: true }
    })

    // invite the player to the game
    const inviteToGame = await database.game_invites.create({
      data: {
        invitee: { connect: { id: Number(req.params.id)}},
        invitedTo: { connect: { id: req.user.id}},
        game: { connect: { id: newGame.id}}
      }
    })

    // add a user to the new game
    const addUserToNewGame = await database.private_connections.create({
      data: {
        user: { connect: { id: req.body.user_id } },
        game: { connect: { id: newGame.id } }
      }
    });

    // initialize the first round for if/when the player joins
    const initRound = await database.rounds.create({
      data: { game: { connect: { id: addUserToNewGame.game_id} } }
    })

    // initialize the player information for this player
    const initPlayerInfo = await database.game_player_information.create({
      data: { 
        round: { connect: { id: initRound.id}},
        user: { connect: { id: req.user.id} }
      }
    })

    // ! find the cards in their selected deck (this means that we need a way for users to select a deck before invite)
    const getPlayerDeckCards = await database.user_deck_cards.findMany({
      where: { deck_id: user.selectedDeckId },
      include: {
        userCards: true
      }
    })

    const mapCards = getPlayerDeckCards.map((deckCard) => {
      return deckCard.userCards;
    }).flat();

    let startingDeck; 
    let startingHand;
    
    if (getPlayerDeckCards.length <= 3) {
      startingDeck = [];
      startingHand = shuffle(mapCards);
    } else {
      startingDeck = shuffle(mapCards);
      startingHand = startingDeck.splice(0, 3);
    }

    // create these cards as a state to be used throughout game
    const makePlayerDeckState = await database.game_card_states.create({
      data: {
        round: { connect: { id: initRound.id} },
        user: { connect: { id: req.user.id } },
        deck: startingDeck,
        hand: startingHand
      }
    })

    console.log(`Creating new game #${newGame.id} for user #${req.body.user_id}.`)

    res.status(201).send(newGame);

  } catch (error) {
    errorHandler(error);
    console.error(`Error on POST request to create a new private game.`)
    res.sendStatus(500);
  }
})

export default privateGames;

