import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';
import rounds from './rounds.ts';
import shuffle from './helpers/shuffle.ts';

const games = express.Router();
games.use('/rounds', rounds);

// provide the player ID, and this will tell you if there is a game
games.get('/:id', async (req: AuthRequest, res) => {

  try {

    const games = await database.user_Games.findMany({
      where: { user_id: Number(req.params.id) },
      include: { game: true}
    })
    console.log("*** GAMES ***\n", games)

    const userHasOpenGame = games.reduce((accum, curr) => {
      if (curr.game.status === true) {
        return curr.game;
      } else {
        return accum;
      }
    }, null)
    
    console.log("*** USER HAS OPEN GAMES ***\n", userHasOpenGame)

    if (!userHasOpenGame){
      res.sendStatus(404);
    } else {
      res.status(200).send(userHasOpenGame);
    }

  } catch (error) {
    console.error(`Error on GET request for an open game associated with user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

// used to create a game AND find an existing game
games.post('/', async (req: AuthRequest, res) => {

  try {

    // preliminary validation checks
    const user = await database.user.findFirst({
      where: {
        id: Number(req.body.user_id),
      }
    })

    if (!user){
      res.sendStatus(400);  // if user invalid, inform client that this is a bad request
      return;
    } else if (!user.selectedDeckId){
      res.sendStatus(400);  // if no selected deck, inform client that this user cannot play a game
      return;
    }

    // first try to find all open games
    const openGames = await database.games.findMany({
      where: {
        status: true,
      },
      include: {
        User_Games: true,
      },
    });
    
    let userHasOpenGame;

    // This section tries to assign a user to an open game, and also includes checks if the user currently has an open game
    // =============================================================================================================

    // filter openGames to create array of only games with one user
    const filteredGames = openGames.filter((game) => {

      // filters active games, prevents joining if already two players in a game
      const withinUserLimit = game.User_Games.length < 2;

      // filters active games, confirming that you aren't already in one
      const isNotUser = game.User_Games.reduce((accum, curr) => {
        if (curr.user_id === req.body.user_id){
          return false;
        } else {
          return accum;
        }
      }, true)

      if (withinUserLimit && isNotUser){
        return game;
      } else if (!isNotUser){
        console.log(`User is listed on an active game session #${game.id}. Redirecting to active game session.`)
        userHasOpenGame = game;
      }
    });

    if (userHasOpenGame){
      res.status(200).send(userHasOpenGame);
      return;
    }
    // =============================================================================================================
    
    // if there are no open games
    if (filteredGames.length === 0) {

      console.log(`No active games found in database.`)

      // create a new game session with the user's socket
      const newGame = await database.games.create({})

      // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
      const addUserToNewGame = await database.user_Games.create({
        data: {
          user: { connect: { id: req.body.user_id } },
          game: { connect: { id: newGame.id } }
        }
      });

      const initRound = await database.rounds.create({
        data: { game: { connect: { id: addUserToNewGame.game_id} } }
      })

      const initPlayerInfo = await database.round_Player_Info.create({
        data: { 
          round: { connect: { id: initRound.id}},
          user: { connect: { id: user.id} }
        }
      })

      // find the cards in that deck
      const getPlayerDeckCards = await database.user_Deck_Cards.findMany({
        where: { deck_id: user.selectedDeckId },
        include: {
          userCards: true
        }
      })

      const mapCards = getPlayerDeckCards.map((deckCard) => {
        return deckCard.userCards;
      }).flat();

      console.log(`Deck cards found: `, getPlayerDeckCards);
      console.log(`Mapped cards are: `, mapCards);

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
      const makePlayerDeckState = await database.game_Card_States.create({
        data: {
          round: { connect: { id: initRound.id} },
          user: { connect: { id: user.id } },
          deck: startingDeck,
          hand: startingHand
        }
      })

      console.log(`Creating new game #${newGame.id} for user #${req.body.user_id}.`)

      res.status(201).send(newGame);

    // if there are available games
    } else {

      console.log(`Game found in database, attempting to add user to game.`)

      const addUserToGame = await database.user_Games.create({
        data: {
          user: { connect: { id: req.body.user_id } },
          game: { connect: { id: filteredGames[0].id } },
        }
      });

      const startingRound = await database.rounds.findFirst({
        where: { game_id: addUserToGame.game_id }
      })

      const initPlayerInfo = await database.round_Player_Info.create({
        data: { 
          round: { connect: { id: startingRound.id}},
          user: { connect: { id: user.id} }
        }
      })

      // find the cards in that deck
      const getPlayerDeckCards = await database.user_Deck_Cards.findMany({
        where: { deck_id: user.selectedDeckId },
        include: {
          userCards: true
        }
      })

      const mapCards = getPlayerDeckCards.map((deckCard) => {
        return deckCard.userCards;
      }).flat();

      console.log(`Deck cards found: `, getPlayerDeckCards);
      console.log(`Mapped cards are: `, mapCards);

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
      const makePlayerDeckState = await database.game_Card_States.create({
        data: {
          round: { connect: { id: startingRound.id} },
          user: { connect: { id: user.id } },
          deck: startingDeck,
          hand: startingHand
        }
      })

      res.status(200).send(filteredGames[0])
    }


  } catch (error) {
    console.error(`Error on request for games for user #${req.body.user_id}.`)
    console.error(error);
    res.sendStatus(500);
  }

})

// used to disable a game, send game ID to end it
games.patch('/:id', async (req: AuthRequest, res) => {

  // req.body.user_id represents the victor for a game
  try {


    if (req.body.data.user_id) {

      const findConnections = await database.user_Games.findMany({
        where: { game_id: Number(req.params.id) }
      });

      const findOpponentID = findConnections.reduce((accum, curr) => {
        if (curr.user_id !== Number(req.body.data.user_id)) { return curr.user_id }
        else { return accum };
      }, -1)

      if (findOpponentID){
        const updateGame = await database.games.update({
          where: {
            id: Number(req.params.id)
          },
          data: {
            status: false,
            end_date: new Date(),
            victor: { connect: { id: findOpponentID } }
          }
        })


        /*
        ============================================================
        Award scores to user; score is based on the amount of rounds
        that were played in the game.
        ============================================================
        */
        const totalRounds = await database.rounds.findMany({
          where: { game_id: Number(req.params.id)}
        })

        let roundCount = totalRounds.length;

        // update user (surrendered) scores
        await database.user.update({
          where: {id: Number(req.body.data.user_id)},
          data: {
            score: { increment: (4 * roundCount) },
            losses: { increment: 1}
          }
        })

        // update enemy (victor) scores
        await database.user.update({
          where: {id: findOpponentID},
          data: {
            score: { increment: (8 * roundCount) },
            wins: { increment: 1}
          }
        })
        /*============================================================*/
  
        console.log(`Game terminated; victor for game session #${req.params.id} is #${findOpponentID}.`)
        res.status(200).send({ GameComplete: updateGame });
      } else {
        res.sendStatus(400);
      }

    } else {
      const updateGame = await database.games.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          status: false,
          end_date: new Date()
        }
      })
      
      console.log(`Game terminated; no victor specified for game session #${req.params.id} upon termination.`);
      res.status(200).send({ GameTerminated: updateGame });
    }

  } catch (error) {
    console.error(`Error on PATCH request to terminate game session #${req.params.id}.`, error)
    res.sendStatus(500);
  }

})

// used to delete a game (if a user is waiting for a game and changes their mind)
games.delete('/:id', async (req: AuthRequest, res) => {

  try {

    const game = await database.games.findFirst({
      where: { id: Number(req.params.id)},
      include: { User_Games: true }
    })

    if ( game.User_Games.length > 1) {
      console.error(`This route is for ending a game search, but two users were found.`);
      console.error(`If users do not want to play this game, they must surrender.`)
      res.sendStatus(203);
    } else {
      await database.games.delete({
        where: { id: Number(req.params.id)}
      })

      res.sendStatus(204);
    }

  } catch (error) {
    console.error(`Error on DELETE request to end a game search on game session #${req.params.id}.`)
    res.sendStatus(500);
  }

})


export default games;