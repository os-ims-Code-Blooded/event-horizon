import express, { Request, Response } from 'express';
import { User, AuthRequest } from '../../helpers/misc/types.ts';
import database from '../../database/index.ts';
import errorHandler from '../../helpers/misc/error_logging/errorHandler.ts';

const settings = express.Router();

settings.get(`/:id` , async (req: AuthRequest, res) => {

  try {

    const userSettings = await database.user_settings.findFirst({
      where: { user_id: Number(req.params.id)}
    })

    if (!userSettings) {
      res.sendStatus(404);
    } else {
      res.status(200).send(userSettings);
    }

  } catch (error) {
    errorHandler(error);
    console.error(`Error on GET request for settings for user #${req.params.id}: `, error)
    res.sendStatus(500);
  }

})

// settings.post(`:id`, async (req: AuthRequest, res) => {

//   try {

//     const foundUserSettings = await database.user_settings.findFirst({
//       where: { user_id: Number(req.params.id)}
//     })

//     if (!foundUserSettings) {
//       const userSettings = await database.user_settings.create({
//         data: {
//           user: { connect: { id: Number(req.params.id)} },
//         }
//       })
//       res.status(201).send(userSettings)
//     } else {
//       res.status(200).send(foundUserSettings);
//     }

//   } catch (error) {
//     console.error(`Error on POST request for settings for user #${req.params.id}: `, error)
//     res.sendStatus(500);
//   }

// })

settings.patch(`/:id`, async (req: AuthRequest, res) => {

  try {


    const options = [
      'dark_mode',
      'colorblind_mode',
      'sfx_volume'
    ]

    if (!req.body.data){
      res.sendStatus(203);
    } else {
      const reqOptions = Object.keys(req.body.data);
      let hasValidOption = false;

      reqOptions.forEach((option) => {
        if (options.includes(option)){
          hasValidOption = true;
        }
      })

      if (!hasValidOption){
        console.error(`No valid options provided for PATCH request to settings for user #${req.params.id}.`)
        res.sendStatus(203);
      }
    }

    if (req.body.data.dark_mode !== undefined && typeof req.body.data.dark_mode === "boolean") {
      await database.user_settings.update({
        where: { user_id: Number(req.params.id) },
        data: { dark_mode: req.body.data.dark_mode }
      })
    }
    
    if (req.body.data.colorblind_mode !== undefined && typeof req.body.data.colorblind_mode === "boolean") {
      await database.user_settings.update({
        where: { user_id: Number(req.params.id) },
        data: { colorblind_mode: req.body.data.colorblind_mode }
      })
    }

    if(req.body.data.sfx_volume){
      await database.user_settings.update({
        where: { user_id: Number(req.params.id) },
        data: { sfx_volume: req.body.data.sfx_volume }
      })
    }

    res.sendStatus(200);

  } catch (error) {
    errorHandler(error);
    console.error(`Error on PATCH request for settings for user #${req.params.id}: `, error)
    res.sendStatus(500);
  }

})

export default settings;