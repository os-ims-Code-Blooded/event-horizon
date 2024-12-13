import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../helpers/misc/types.ts';
import path from 'path';
import dotenv from "dotenv";
import database from '../../database/index.ts';
import collections from './cards/collection.ts';
import friends from './friends.ts';
import decks from './cards/decks.ts';
import games_history from './games.ts';
import settings from './settings.ts';
import errorHandler from '../../helpers/misc/error_logging/errorHandler.ts';


const profile = express.Router();
profile.use('/collections', collections);
profile.use('/friends', friends);
profile.use('/decks', decks);
profile.use('/games-history', games_history);
profile.use('/settings', settings);

profile.get('/:id', async (req: AuthRequest, res) => {

  try {

    // if no user specified
    if (!req.params.id){
      res.sendStatus(203);
    } else {

      // find user with that ID
      const user = await database.user.findUnique({
        where: {
          id: Number(req.params.id)
        }, 
        include: {
          friends: true,
          friendOf: true,
          Games: true,
          User_Cards: true,
          User_Decks: true
        }
      })

      if (!user){
        res.sendStatus(404);        // if no user found
      } else {
        res.status(200).send(user); // else, send user
      }

    }

  } catch (error){
    errorHandler(error);
    if (req.params.id){ 
      console.error(`Error on GET request for specified user #${req.params.id}.`)
    } else {
      console.error(`Error, no user specified in GET request parameters.`)
    }
    res.sendStatus(500);
  }

})

profile.get('/', async (req: AuthRequest, res) => {

  try {

    if (req.user) {
      const user = await database.user.findFirst({
        where: { id: req.user.id }
      })
  
      if (!user){
        res.sendStatus(404);
      } else {
        res.status(200).send(user);
      }
    } else {
      res.sendStatus(203);
    }

  } catch (error){
    errorHandler(error);
    console.error(`Error on GET request for user.`, error)
    res.sendStatus(500);
  }

})

profile.get('/top-scores/:id', async (req: AuthRequest, res) => {

  try {
    //find top 10 users sorted by highest score
    const topUsers = await database.user.findMany({
      orderBy:
        {
          score: 'desc',
        },
      take: 10,
    });

    // check if any users are returned
    if (!topUsers || topUsers.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send(topUsers);
    }
  } catch (error) {
    errorHandler(error);
    console.error(`Error on GET request for leaderboard: ${error.message}`);
    res.sendStatus(500);
  }
});

profile.get('/all', async (req: AuthRequest, res) => {

  try {
    const users = await database.user.findMany();

    if (!users){
      res.sendStatus(404);
    } else {
      res.status(200).send(users);
    }

  } catch (error){
    errorHandler(error);
    console.error(`Error on GET request for all user profiles.`)
    res.sendStatus(500);
  }

})

profile.post('/', async (req: AuthRequest, res) => {

  try {
    // pull all associated data from request
    const user = {
      data: req.body.data,
    }
  
    const createUser = await database.user.create(user)

    res.status(201).send(createUser);

  } catch (error) {
    errorHandler(error);
    console.error(`Error on POST request for user.`)
    res.sendStatus(500);
  }

})

profile.delete('/:id', async (req: AuthRequest, res) => {

  try {

    // if an ID is not specified, inform client
    if (!req.params.id){
  
      res.sendStatus(203);

    // else we delete the user and we must also delete all associated data
    } else {

      // find user with that ID and delete
      const user = await database.user.delete({
        where: {
          id: Number(req.params.id)
        }
      })
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy((error) => {
          if (error) {
            return res.status(500).json({ message: 'Error destroying session' });
          }
          res.sendStatus(204);
        });
      });
    }

  } catch (error){
    errorHandler(error);
    if (req.params.id){ 
      console.error(`Error on DELETE request for specified user #${req.params.id}.`)
    } else {
      console.error(`Error, no user specified in DELETE request parameters.`)
    }
    res.sendStatus(500);
  }

})

profile.patch('/:id', async (req: AuthRequest, res) => {
  try {

    // if no patch specified, indicate nothing received
    if (!req.body){
      res.sendStatus(203);
    } else {

      const data = req.body;

      // find the user, update with whatever was specified
      const user = await database.user.update({
        where : {
          id: Number(req.params.id)
        },
        data: data
      })

      res.status(200).send(user);

    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on PATCH request for user #${req.params.id}`, error)
    res.sendStatus(500);
  }

})


// profile search
profile.get('/users/search', async (req: AuthRequest, res) => {
  const { name } = req.query;

  try {
    const users = await database.user.findMany({
      where: {
        name: {
          contains: String(name)
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).send(users);
  } catch (error) {
    errorHandler(error);
    console.error('Error searching for users');
    res.sendStatus(500);
  }
});



export default profile;