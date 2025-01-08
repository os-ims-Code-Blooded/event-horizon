import express, { Request, Response } from 'express';
import database from './database/index.ts';
import createAction from './helpers/createAction.ts';
import calculateGameState from './helpers/calculateGameState.ts';
import calculatePlayerState from './helpers/calculatePlayerState.ts';
import generateResponse from './helpers/generateResponse.ts';
import { Prisma } from '@prisma/client';
import { connect } from 'http2';
import shuffle from './helpers/shuffle.ts';
import errorHandler from './helpers/misc/error_logging/errorHandler.ts';

export default async function gameHandler(req: any, skip: boolean = false) {

  try {

    // get the current Round and peripherals
    const currentRound = await database.rounds.findFirst({
      where: { id: Number(req.body.data.round_id)},
      include: {
        round_effects: true,
        game_player_information: true,
        actions: true,
        actions_loaded: true,
      }
    })

    // if action is found belonging to player
    const playerHasAction = currentRound.actions.filter((action) => action.user_id === req.body.data.user_id)

    // if this is the first action submitted for a round
    if (playerHasAction.length > 0 && !skip) {
      await createAction(req);
      return {
        "Success": true,
        "Message": `Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`,
        "Waiting": true,
        "user_id": req.body.data.user_id
      }
    } else if (currentRound.actions.length === 0 && !skip){

      // we create an action
      await createAction(req);
      
      /**
       * We initialize a safetyNet here, but what is this actually doing?
       * Basically this handles the case that two players have submitted their turn,
       * but it was done so quickly that the gameHandler did not process any information.
       */
      let safetyNet;

      /**
       * We check on an interval to see if two actions exist for this interaction.
       */
      let safetyInterval = setInterval(async () => {
        try {
          safetyNet = await database.rounds.findFirst({
            where: { id: Number(req.body.data.round_id)},
            include: {
              round_effects: true,
              game_player_information: true,
              actions: true,
              actions_loaded: true,
            }
          })

          /**
           * If two actions are found for the current round, only one iteration of the gameHandler
           * will be retriggered through this code block.
           */
          if (safetyNet.actions.length === 2 && Number(req.body.data.user_id) === safetyNet.actions[0].user_id && !safetyNet.end_date) {
            console.log(`Success on safety check, processing request now...`)
            gameHandler(req, true);               // re-run the gameHandler
            clearInterval(safetyInterval);        // clear the interval
          } else if (safetyNet.end_date){
            console.log(`Safety net does not need to occur at this time, round has ended...`);
            clearInterval(safetyInterval);
          } else {
            console.log(`Initiating a safety interval check...`)
          }

        } catch (error) {
          errorHandler(error);
          console.error(`Error within safety net for gameHandler.`)
        }
      }, 15000)
      
      return {
        "Success": true,
        "Message": `Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`,
        "Waiting": true,
        "user_id": req.body.data.user_id
      }

    // else if this is the second (and last) action submitted for a round
    } else if (currentRound.actions.length > 0){

      if (!skip) {
        // create the action for this user
        await createAction(req);
      }

      // then attempt to perform calculations, and store the results
      const updateState = await calculateGameState(req, currentRound.game_id);

      // acquire the current player information
      let updatePlayers = currentRound.game_player_information.slice();

      // end the current round
      await database.rounds.update({
        where: { id: req.body.data.round_id},
        data: { end_date: new Date() }
      })

      // create a new round for the game only after all calculations have succeeded
      const newRound = await database.rounds.create({
        data: { 
          game: { connect: {id: currentRound.game_id } },
          actual: currentRound.actual + 1
        }
      })

      // returns an array of new players after updates
      updatePlayers = calculatePlayerState(updatePlayers, updateState, newRound.id);

      // for every player, we create an updated snapshot of their health/armor on the next round
      for (let i = 0; i < updatePlayers.length; i++){
        const newPlayerInfo = await database.game_player_information.create({
          data: updatePlayers[i]
        })
      }

      // for every player, we find the current snapshot of their card deck
      const pullGameDeckStates = await database.game_card_states.findMany({
        where: { round_id: currentRound.id }
      });
      
      // for every player, we get a snapshot of their card deck after changes
      for (let i = 0; i < pullGameDeckStates.length; i++) {
        const newState = await database.game_card_states.create({ 
          data: {
            user: { connect: { id: pullGameDeckStates[i].user_id}},
            round: { connect: { id: newRound.id} },
            deck: pullGameDeckStates[i].deck,
            hand: pullGameDeckStates[i].hand
          }
        })
      }

      // finally we generate a response to be sent to the client
      const formattedResponse = await generateResponse(newRound.id, currentRound.id);

      return (formattedResponse);

    }


  } catch (error) {
    errorHandler(error);
    console.error(`Fatal error encountered within gameHandler, error message follows: `, error);
    return {
      "Success": false,
      "Message": `Error on client in processing turn submission.`
    }
  }

};