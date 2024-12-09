import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../misc/types.ts';
import database from '../../db/index.ts';
import errorHandler from '../../misc/error_logging/errorHandler.ts';

const friends = express.Router();

friends.get('/:id', async (req: AuthRequest, res) => {

  try {

    if (!req.params.id){

      res.sendStatus(203);
      
    } else {

      const getFriends = await database.user.findFirst({
        where: { id: Number(req.params.id) },
        include: {
          friends: true,
          friendOf: true,
        }
      })

      const filterUserFriends = getFriends.friends.map((friend) => friend.friend_id);
      const filterUserFriendOf = getFriends.friendOf.map((friend) => friend.user_id);
      
      const userFriends = await database.user.findMany({
        where: { id: { in: filterUserFriends } }
      })

      const userFriendsOf = await database.user.findMany({
        where: { id: { in: filterUserFriendOf } }
      })

      const preformatResponse: any = {
        friends: userFriends,
        followers: userFriendsOf
      }

      if (!friends) { res.sendStatus(404) } 
      else          { res.status(200).send(preformatResponse) }
    }

  } catch (error){
    errorHandler(error);
    console.error(`Error on a GET request for friends associated with user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

friends.post('/:id', async (req: AuthRequest, res) => {
  try {
    if (!req.params.id){
      console.error(`No primary user designated in POST request parameters for friends.`)
      res.sendStatus(203);
    } else if (!req.body.data.id){
      console.error(`No secondary user designated in POST request body for friends.`)
      res.sendStatus(203);
    } else {
      await database.friends.create({
        data: {
          user_id: Number(req.params.id),
          friend_id: Number(req.body.data.id)
        }
      })

      res.sendStatus(201);
    }

  } catch (error){
    errorHandler(error);
    console.error(`Error on create friend #${req.body.data.id} for user #${req.params.id}.`)
    res.sendStatus(500);
  }
})

// If encounter issue with Axios request, read discussion below.
// https://masteringjs.io/tutorials/axios/delete-with-body
friends.delete('/:id', async (req: AuthRequest, res) => {

  try {

    if (!req.params.id){
      console.error(`No primary user designated in DELETE request parameters for friends.`)
      res.sendStatus(203);
    } else if (!req.body.id){
      console.error(`No secondary user designated in DELETE request body for friends.`)
      res.sendStatus(203);
    } else {

      const friends = await database.friends.deleteMany({
        where: {
          AND: [
            {
              user_id: Number(req.params.id),
            },
            { friend_id: Number(req.body.id)},
          ],
        }
      })

      const friendsOf = await database.friends.deleteMany({
        where: {
          AND: [
            {
              user_id: Number(req.body.id),
            },
            { friend_id: Number(req.params.id)},
          ],
        }
      })

      res.sendStatus(204);
      
    }
  } catch (error) {
    errorHandler(error);
    console.error(`Error on delete friend #${req.body.id} for user #${req.params.id}.`)
    res.sendStatus(500);
  }
})

export default friends;