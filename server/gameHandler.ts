import express, { Request, Response } from 'express';
import database from './db/index.ts';
import createAction from './routes/games/helpers/createAction.ts';
import calculateGameState from './routes/games/helpers/calculateGameState.ts';
import calculatePlayerState from './routes/games/helpers/calculatePlayerState.ts';
import generateResponse from './routes/games/helpers/generateResponse.ts';
import { Prisma } from '@prisma/client';
import { connect } from 'http2';
import shuffle from './routes/games/helpers/shuffle.ts';

export default async function gameHandler(req: any) {

  try {

    // get the current Round and peripherals
    const currentRound = await database.rounds.findFirst({
      where: { id: Number(req.body.data.round_id)},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })
    console.log("REQ BODY", req.body);
    // if this is the first action submitted for a round
    if (currentRound.Actions.length === 0){

      await createAction(req);
      return {
        "Success": true,
        "Message": `Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`,
        "Waiting": true,
        "user_id": req.body.data.user_id
      }

    // else if this is the second (and last) action submitted for a round
    } else if (currentRound.Actions.length > 0){

      // create the action for this user
      await createAction(req);

      // then attempt to perform calculations, and store the results
      const updateState = await calculateGameState(req, currentRound.game_id);

      // acquire the current player information
      let updatePlayers = currentRound.Round_Player_Info.slice();

      console.log(`Current player information to be used in calculations is: `, updatePlayers)

      // end the current round
      await database.rounds.update({
        where: { id: req.body.data.round_id},
        data: { end_date: new Date() }
      })

      // create a new round for the game only after all calculations have succeeded
      const newRound = await database.rounds.create({
        data: { game_id: currentRound.game_id}
      })

      // returns an array of new players after updates
      updatePlayers = calculatePlayerState(updatePlayers, updateState, newRound.id);

      for (let i = 0; i < updatePlayers.length; i++){
        const newPlayerInfo = await database.round_Player_Info.create({
          data: updatePlayers[i]
        })
      }

      // pull all game deck states
      const pullGameDeckStates = await database.game_Card_States.findMany({
        where: { round_id: currentRound.id }
      });

      console.log(`Successfully pulled all deck states for the game, follows: `, pullGameDeckStates);
      
      // remap them for creation of a new deck state
      const deckStatesToCreate = pullGameDeckStates.map((state) => {
        return {
          user: state.user_id,
          deck: state.deck,
          hand: shuffle(state.deck).slice(0, 3)
        }
      })
      
      // for every item in the deckStates to create
      for (let i = 0; i < deckStatesToCreate.length; i++) {
        const newState = await database.game_Card_States.create({ 
          data: {
            user: { connect: { id: deckStatesToCreate[i].user}},
            round: { connect: { id: newRound.id} },
            deck: deckStatesToCreate[i].deck,
            hand: deckStatesToCreate[i].hand
          }
        })

        console.log(`New deck state created for user #${deckStatesToCreate[i].user}: `, newState);
      }

      const formattedResponse = await generateResponse(newRound.id, currentRound.id, updateState);

      return (formattedResponse);

    }


  } catch (error) {
    console.error(`Fatal error encountered within Rounds router (rounds.ts), error message follows: `, error);
    return {
      "Success": false,
      "Message": `Error on client in processing turn submission.`
    }
  }

};