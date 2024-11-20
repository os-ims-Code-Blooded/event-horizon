import express, { Request, Response } from 'express';
import database from '../../db/index.ts';

const games = express.Router();

// used to get all games for user that have a victor specified
games.get('/:id', async (req, res) => {

  try {

    // find all games associated with a user
    let userGames = await database.user_Games.findMany({
      where: {
        user_id: Number(req.params.id)
      }
    })

    // create only an array of game IDs associated with that user
    const gameIDs = userGames.map((game) => game.game_id);

    // get all games that have been associated with user
    let games = await database.games.findMany({
      where: {
        id: {
          in: gameIDs,
        },
      },
    });

    // filter games to only include games that have a victor defined
    games = games.filter((game) => {
      if (game.victor_id) {
        return game;
      }
    })

    if (games.length === 0) {
      res.sendStatus(404);          // if games were not found, respond with 404
    } else {
      res.status(200).send(games);  // if games were found, respond with 200
    }

  } catch (error) {
    console.error(`Error on request for all games associated with user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

// used to create a game AND find an existing game
games.post('/', async (req, res) => {

  try {

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

    // filter openGames to create array of only games with one user
    const filteredGames = openGames.filter((game) => {

      // filters active games, prevents joining if already two players in a game
      const withinUserLimit = game.User_Games.length < 2;

      // filters active games, confirming that you aren't already in one
      const isNotUser = game.User_Games.reduce((accum, curr) => {
        if (curr.user_id === req.body.data.user_id){
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
    
    // if there are no open games
    if (filteredGames.length === 0) {

      console.log(`No active games found in database.`)

      // create a new game session with the user's socket
      const newGame = await database.games.create({})

      // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
      await database.user_Games.create({
        data: {
          user: { connect: { id: req.body.data.user_id } },
          game: { connect: { id: newGame.id } },
          deck_name: req.body.data.deck_name
        }
      });

      console.log(`Creating new game #${newGame.id} for user #${req.body.data.user_id}.`)

      res.status(201).send(newGame);

    // if there are available games
    } else {

      console.log(`Game found in database, attempting to add user to game.`)

      // console.log(req.body.data.user_id, req.body.data.deck_name, filteredGames[0])
      const addUserToGame = await database.user_Games.create({
        data: {
          user: { connect: { id: req.body.data.user_id } },
          game: { connect: { id: filteredGames[0].id } },
          deck_name: req.body.data.deck_name
        }
      });

      console.log(addUserToGame);

      res.status(200).send(filteredGames[0])
    }


  } catch (error) {
    console.error(`Error on request for games for user #${req.body.data.user_id}.`)
    console.error(error);
    res.sendStatus(500);
  }

})

// used to disable a game, send game ID to end it
games.patch('/:id', async (req, res) => {

  // req.body.data.user_id represents the victor for a game
  try {

    let victor;

    if (!req.body.data){
      victor = null;
    } else {
      victor = Number(req.body.data.user_id);
    }

    if (victor) {
      const updateGame = await database.games.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          status: false,
          end_date: new Date(),
          victor_id: victor
        }
      })

      console.log(`Game terminated; victor for game session #${req.params.id} is #${victor}.`)
      res.status(200).send(updateGame);

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
      res.status(200).send(updateGame);
    }

  } catch (error) {
    console.error(`Error on PATCH request to terminate game session #${req.params.id}.`)
    res.sendStatus(500);
  }

})

export default games;