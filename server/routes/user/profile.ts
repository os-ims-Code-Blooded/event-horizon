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


      /*

      We have a bit of a problem here and for a few reasons. The first thing is that we 
      can't just delete a user...first we would have to delete all other records that are 
      using the current user as a foreign key. If we don't do this, the database operation
      fails.

      This introduces a new problem, however...if I delete a user's records then their game
      records are deleted too...this means that players would suddenly no longer have some
      "wins" on their records with our current implementation.

      Current hypothesis is that we can delete most user data from the database such as the following:
        - friend associations
        - cards associated with a deck  // we actually can't delete these either because Rounds && Games depend on them as a foreign key
        - decks themselves              // we actually can't delete these either because Rounds && Games depend on them as a foreign key
        - then we can delete the cards 

      With the previous notes in mind, maybe we just preserve the user_id but delete personal information? 
        - Change the display name to something like "deleted user"
        - Change the googleID to null so they can't login to this account anymore
        - Remove the email associated with the account so they can sign up again with that email

      The only thing we need to figure out is how we can make these nullable, given that all three of the prior constraints are unique.
      
      */

      // find user with that ID and delete
      const user = await database.user.delete({
        where: {
          id: Number(req.params.id)
        }
      })

      
      if (!user){
        res.sendStatus(404);  // if no user found
      } else {
        res.sendStatus(200);  // else inform user has been deleted   
      }
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
    if (!req.body.data){
      res.sendStatus(203);
    } else {

      const data = req.body.data;

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

export default profile;