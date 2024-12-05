import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';

const games_history = express.Router();

// used to get all games for user that the user has won
games_history.get('/won/:id', async (req: AuthRequest, res) => {

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
      if (game.victor_id === Number(req.params.id)) {
        return game;
      }
    })

    if (games.length === 0) {
      res.sendStatus(404);          // if games were not found, respond with 404
    } else {
      res.status(200).send(games);  // if games were found, respond with 200
    }

  } catch (error) {
    console.error(`Error on request for won games associated with user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

// used to get all games that a user has lost
games_history.get('/lost/:id', async (req: AuthRequest, res) => {

  try {

    // find all games associated with the user
    const userGames = await database.user_Games.findMany({
      where: {
        user_id: Number(req.params.id)
      },
      select: {
        game_id: true
      }
    })
    
    // create just an array of game IDs that reflect games the user has played
    const formatUserGames = userGames.map((game) => game.game_id)
    
    // create an array of games where the user was not the victor
    const gamesPossLost1 = await database.games.findMany({
      where: {
        NOT: [
          { victor_id: 
            { 
              equals: Number(req.params.id)
            }
          }
        ],
        AND: [
          {id: { in: formatUserGames}}
        ],
      }
    })

    const gamesPossLost2 = await database.games.findMany({
      where: {
        AND: [
          { victor_id: null },
          { id: { in: formatUserGames} }
        ]
      }
    })

    const gamesPossLost = gamesPossLost1.concat(gamesPossLost2);

    // format gamesPossLost as an array of game IDs
    const formatGamesPossLost = gamesPossLost.map((game) => game.id)

    // see if there were users in that game
    const wereOpponentsInGame = await database.user_Games.findMany({
      where: {
        game_id: { in: formatGamesPossLost}
      }
    })

    // we need to make an object where we count games with associations greater than 2
    let determineRelevantGames: any = {};

    wereOpponentsInGame.forEach((game) => {
      if (!determineRelevantGames[game.game_id]){
        determineRelevantGames[game.game_id] = 1;
      } else {
        determineRelevantGames[game.game_id] += 1;
      }
    })

    const validGamesPlayed = []

    for (const key in determineRelevantGames){
      if (determineRelevantGames[key] > 1){
        validGamesPlayed.push(Number(key));
      }
    }

    // finally, we do one more search for the games
    const validGamesLost = await database.games.findMany({
      where: {
        id: { in: validGamesPlayed}
      }
    })

    if (!validGamesLost) {
      res.sendStatus(404);
    } else {
      res.status(200).send(validGamesLost);
    }

  } catch (error) {
    console.error(`Error on GET request for games lost by user #${req.params.id}.`);
    res.sendStatus(500);
  }

})

export default games_history;