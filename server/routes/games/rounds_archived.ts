import express, { Request, Response } from 'express';
import database from '../../db/index.ts';

const rounds = express.Router();

/*
req.body = 
{
 "data": {
  "round_id": 1,
  "user_id": 1,
  "action": "FIRE" || "LOAD" || "BLOCK",
  "card_id": 1,
 }
}
*/

rounds.post('/', async (req, res) => {

  try {

    // first, find the current round
    let currentRound = await database.rounds.findFirst({
      where: { id: Number(req.body.data.round_id) },
      include: { 
        Actions: true,
        Actions_Loaded: true,
        Round_Effects: true,
        Round_Player_Info: true 
      }
    })

    // critical; used much later for calculating the changes from a round
    const calculations: any = {}

    // if this post would end the round, do the following
    if (currentRound.Actions.length > 0){

      // initialize a new action
      let newAction;

      // if no card passed in for this action
      if (!req.body.data.card_id){
        newAction = await database.actions.create({
          data: {
            round_id: currentRound.id,
            user_id: Number(req.body.data.user_id),
            action: req.body.data.action
          }
        })
      // if a card was passed in for this action
      } else {
        const isValidCard = await database.cards.findUnique({
          where: { id: req.body.data.card_id }
        })

        newAction = await database.actions.create({
          data: {
            round_id: currentRound.id,
            user_id: Number(req.body.data.user_id),
            action: req.body.data.action,
            card_id: isValidCard.id,
            damage: isValidCard.damage,
            armor: isValidCard.armor,
            duration: isValidCard.duration,
            effect: isValidCard.effect
          }
        })
      }

      // add end date to the currentRound
      const updateRound = await database.rounds.update({
        where: { id: currentRound.id },
        data: { end_date: new Date() }
      })

      // create a new round (newRound)
      const newRound = await database.rounds.create({
        data: { game_id: currentRound.game_id }
      })
      
      // create a copy of player info
      const getPlayers = currentRound.Round_Player_Info.slice();

      // find all round actions, these will be used to determine new player info
      const getRoundActions = await database.actions.findMany({
        where: { round_id: currentRound.id }
      })

      // find all current effects, these will be used to determine new player info
      const getCurrentEffects = await database.round_Effects.findMany({
        where: { game_id: currentRound.game_id }
      });

      // for each effect listed for this game
      getCurrentEffects.forEach( async (effect) => {

        if (!calculations[effect.user_id]){
          calculations[effect.user_id] = {};
          calculations[effect.user_id]['damage'] = 0;
          calculations[effect.user_id]['armor'] = 0;
        }

        // if effect has expired, delete the effect
        if (effect.time_elapsed === effect.duration){
          await database.round_Effects.delete({
            where: { id: effect.id }
          })

        // else take it into account for calculations
        } else {

          calculations[effect.user_id].damage += effect.damage;
          calculations[effect.user_id].armor += effect.armor;
          await database.round_Effects.update({
            where: { id: effect.id },
            data: { time_elapsed: effect.time_elapsed + 1}
          })
        }
      })


      getRoundActions.forEach( async (action) => {
        if (!calculations[action.user_id]){
          calculations[action.user_id] = {};
          calculations[action.user_id]['damage'] = 0;
          calculations[action.user_id]['armor'] = 0;
        }
        calculations[action.user_id]['hasBlocked'] = false;
      })

      // for each action listed for this game (max 2)
      getRoundActions.forEach( async (action) => {

        switch(action.action){
          case 'FIRE':

            // find the card that is loaded for fire
            const loadedArmament = await database.actions_Loaded.findFirst({
              where: { user_id: action.user_id }
            })

            if (!loadedArmament) {
              // if no card then damage is just 5 (basic attack)
              calculations[action.user_id].damage += 5;
            } else if (loadedArmament.duration === 0){
              // add that card's damage to our calculations
              calculations[action.user_id].damage += loadedArmament.damage;

              // remove the card that is loaded
              await database.actions_Loaded.deleteMany({
                where: { user_id: action.user_id }
              })

            } else {
              // if card has damage && an effect
              calculations[action.user_id].damage += loadedArmament.damage;
              await database.round_Effects.create({
                data: {
                  round_id: loadedArmament.round_id,
                  user_id: loadedArmament.user_id,
                  card_id: loadedArmament.card_id,
                  damage: loadedArmament.damage,
                  duration: loadedArmament.duration,
                  armor: loadedArmament.armor,
                  game_id: loadedArmament.game_id,
                  effect: loadedArmament.effect,
                  action_id: loadedArmament.id
                }
              })

              // remove the card that is loaded
              await database.actions_Loaded.deleteMany({
                where: { user_id: action.user_id }
              })
            }
            
            console.log(`Init calculations: `, calculations);
            break;

          case 'LOAD':
            
            if (action.duration > 0 && action.armor > 0 && action.damage === 0){
              // if the loaded card is a defensive passive, just create effect (this card is not fired)
              await database.round_Effects.create({
                data: {
                  round_id: action.round_id,
                  user_id: action.user_id,
                  card_id: action.card_id,
                  damage: action.damage,
                  duration: action.duration,
                  armor: action.armor,
                  game_id: currentRound.game_id,
                  effect: action.effect,
                  action_id: action.id
                }
              })

            } else {

              const cardToLoad = await database.cards.findUnique({
                where: { id: Number(req.body.data.card_id)}
              })

              // if the loaded card must be fired, then add it to loaded
              await database.actions_Loaded.create({
                data: {
                  game_id: currentRound.game_id,
                  round_id: currentRound.id,
                  action_id: action.id,
                  user_id: action.user_id,   
                  card_id: cardToLoad.id,
                  damage: cardToLoad.damage,
                  armor: cardToLoad.armor,     
                  duration: cardToLoad.duration,
                  effect: cardToLoad.effect    
                }
              })
            }
            break;
          case 'BLOCK':
            // simple boolean
            calculations[action.user_id]['hasBlocked'] = true;
            break;
        }
      })


      // used to update player defense ratings before we begin damage calculations
      getPlayers.forEach((player) => {

        // if there are armor values to calculate, do it
        // implied else, do nothing but change round_id
        if (calculations[player.user_id].armor) {
          player.armor += calculations[player.user_id].armor;
        }

        player.round_id = newRound.id;
      })

      
      // actually performs the calculations with data from calculations{}
      // for every player in the getPlayers array
      let updatePlayerHitPoints = getPlayers.map((player) => {

        // loop through the keys of "calculations"
        for (const key in calculations) {

          // when we find the opponent (key user_id !== this player's id)
          if (Number(key) !== player.user_id) {
            
            let currentArmor = player.armor;                        // store our current armor
            let damageTaken = calculations[key].damage ? calculations[key].damage : 0;             // see what damage is stored at this key
            const userDidBlock = calculations[player.user_id].hasBlocked // see if our player has blocked

            
            if (userDidBlock){
              damageTaken = Math.round(damageTaken * 0.50)  // if has blocked, then reduce damage
            }
            
            const didNotDestroyArmor = currentArmor - damageTaken;  // see if this damage will penetrate

            if (didNotDestroyArmor) {
              player.armor = didNotDestroyArmor;                    // if not, then update armor for player
            } else {
              const armorDestroyed = didNotDestroyArmor;            // if did destroy armor
              player.armor = 0;                                     // set armor to 0 (can't be negative)
              player.health += armorDestroyed;                      // add armorDestroyed (negative number remainder)
            }
          }

        }

        return player;  // Finally, return this updated player object to this array
      })

      // create new player information entries for these calculations; 
      updatePlayerHitPoints.forEach( async (player) => {
        await database.round_Player_Info.create({ 
          data: {
            round_id: player.round_id,
            user_id: player.user_id,
            armor: player.armor,
            health: player.health,
          }
        })
      })

      // pull newRoundInfo after this creation, so that it is one object record
      const newRoundInfo = await database.rounds.findFirst({ 
        where: { 
          id: newRound.id
        },
        include: {
          Round_Player_Info: true
        }
      })
      
      currentRound = await database.rounds.findFirst({
        where: { id: Number(req.body.data.round_id) },
        include: { 
          Actions: true,
          Actions_Loaded: true,
          Round_Effects: true,
          Round_Player_Info: true 
        }
      })

      // send the newRoundInfo && previousRoundInfo
      const preformatResponse = {
        currentRound: newRoundInfo,
        previousRound: currentRound
      }

      res.status(201).send(preformatResponse);
    
    // else if this post would not end the round, do something else
    } else {

      let newAction;

      // if no card passed in for this action
      if (!req.body.data.card_id){
        newAction = await database.actions.create({
          data: {
            round_id: currentRound.id,
            user_id: Number(req.body.data.user_id),
            action: req.body.data.action
          }
        })

      // if a card was passed in for this action
      } else {

        const isValidCard = await database.cards.findUnique({
          where: { id: req.body.data.card_id }
        })

        newAction = await database.actions.create({
          data: {
            round_id: currentRound.id,
            user_id: Number(req.body.data.user_id),
            action: req.body.data.action,
            card_id: isValidCard.id,
            damage: isValidCard.damage,
            armor: isValidCard.armor,
            duration: isValidCard.duration,
            effect: isValidCard.effect
          }
        })
      }

      res.sendStatus(201);

    }

  } catch (error) {
    console.error(`Error in main rounds architecture: `, error);
    res.sendStatus(500);
  }

})

export default rounds;