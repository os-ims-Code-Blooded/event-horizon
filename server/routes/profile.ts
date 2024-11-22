import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from "dotenv";
import database from '../db/index.ts';

const profile = express.Router();

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

    // else we delete the user
    } else {

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