import express, { Request, Response } from 'express';
import database from '../db/index.ts';

const friends = express.Router();

friends.get('/:id', async (req, res) => {

  try {

    if (!req.params.id){
      res.sendStatus(203);
    } else {

      // finds any friend relationship in the database
      let friendIDs: any = await database.friends.findMany({
        where: {
          OR: [
            {
              user_id: Number(req.params.id),
            },
            { friend_id: Number(req.params.id)},
          ],
        }
      })
      
      // reduce the friends found to an array of only friend IDs
      friendIDs = friendIDs.reduce((accum: any, curr: any) => {

        if (curr.user_id !== req.params.id){
          accum.push(curr.user_id)
          return accum;
        } else if (curr.friend_id !== req.params.id){
          accum.push(curr.friend_id);
          return accum;
        } else {
          return accum;
        }

      }, [])

      // return all friends specified in friendIDs
      const friends = await database.friends.findMany({
        where: {
          id: {
            in: friendIDs,
          },
        },
      })


      if (!friends){
        res.sendStatus(404);
      } else {
        res.status(200).send(friends);
      }

    }

  } catch (error){
    console.error(`Error on a GET request for friends associated with user #${req.params.id}.`)
    res.sendStatus(500);
  }

})

friends.post('/:id', async (req, res) => {
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
    console.error(`Error on create friend #${req.body.data.id} for user #${req.params.id}.`)
    res.sendStatus(500);
  }
})

// If encounter issue with Axios request, read discussion below.
// https://masteringjs.io/tutorials/axios/delete-with-body
friends.delete('/:id', async (req, res) => {
  
  try {
  
    if (!req.params.id){
      console.error(`No primary user designated in DELETE request parameters for friends.`)
      res.sendStatus(203);
    } else if (!req.body.data.id){
      console.error(`No secondary user designated in DELETE request body for friends.`)
      res.sendStatus(203);
    } else {
      
      const friends = await database.friends.deleteMany({
        where: {
          AND: [
            {
              user_id: Number(req.params.id),
            },
            { friend_id: Number(req.body.data.id)},
          ],
        }
      })

      const friendsOf = await database.friends.deleteMany({
        where: {
          AND: [
            {
              user_id: Number(req.body.data.id),
            },
            { friend_id: Number(req.params.id)},
          ],
        }
      })

      if (!friends && !friendsOf){
        res.sendStatus(404);
      } else {
        res.sendStatus(201);
      }

    }
  } catch (error) {
    console.error(`Error on delete friend #${req.body.data.id} for user #${req.params.id}.`)
    res.sendStatus(500);
  }
})

export default friends;