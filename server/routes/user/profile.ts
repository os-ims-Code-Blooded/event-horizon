import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from "dotenv";
import database from '../../db/index.ts';
import collections from './cards/collection.ts';
import friends from './friends.ts';
import decks from './cards/decks.ts';
import games_history from './games.ts';


const profile = express.Router();
profile.use('/collections', collections);
profile.use('/friends', friends);
profile.use('/decks', decks);
profile.use('/games-history', games_history)

profile.get('/:id', async (req, res) => {

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
    if (req.params.id){ 
      console.error(`Error on GET request for specified user #${req.params.id}.`)
    } else {
      console.error(`Error, no user specified in GET request parameters.`)
    }
    res.sendStatus(500);
  }

})

profile.get('/top-scores/:id', async (req, res) => {
  // console.log('REQ', req);
  try {
    //find top 10 users sorted by highest score
    const topUsers = await database.user.findMany({
      orderBy:
        {
          score: 'desc',
        },
      take: 10,
    });
    // console.log('Top users', topUsers);
    // check if any users are returned
    if (!topUsers || topUsers.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send(topUsers);
    }
  } catch (error) {
    console.error(`Error on GET request for leaderboard: ${error.message}`);
    res.sendStatus(500);
  }
});

profile.get('/', async (req, res) => {

  try {
    const users = await database.user.findMany();

    if (!users){
      res.sendStatus(404);
    } else {
      res.status(200).send(users);
    }

  } catch (error){
    console.error(`Error on GET request for all user profiles.`)
    res.sendStatus(500);
  }

})

profile.post('/', async (req, res) => {

  try {
    // pull all associated data from request
    const user = {
      data: req.body.data,
    }
  
    const createUser = await database.user.create(user)

    res.status(201).send(createUser);

  } catch (error) {
    console.error(`Error on POST request for user.`)
    res.sendStatus(500);
  }

})

profile.delete('/:id', async (req, res) => {

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

      res.sendStatus(204);
    }

  } catch (error){
    if (req.params.id){ 
      console.error(`Error on DELETE request for specified user #${req.params.id}.`)
    } else {
      console.error(`Error, no user specified in DELETE request parameters.`)
    }
    res.sendStatus(500);
  }

})

profile.patch('/:id', async (req, res) => {
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
    console.error(`Error on PATCH request for user #${req.params.id}`)
  }

})


// profile search
profile.get('/users/search', async (req, res) => {
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
    console.error('Error searching for users');
    res.sendStatus(500);
  }
});



export default profile;