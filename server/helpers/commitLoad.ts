import database from "../database/index.ts";
import shuffle from "./shuffle.ts";


export default async function commitLoad(req: any, game: number, action: any){

  try {


    /*=====================================================================*/
    const isLethalPayload = (action.damage > 0 && action.armor === 0);
    const isNonLethalPayload = (action.armor > 0 && action.damage === 0);
    /*=====================================================================*/


    if (action.expedite && action.card.expedite) {

      await database.actions_Loaded.deleteMany({
        where: { user_id: action.user_id }
      })

      await database.actions_Loaded.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: action.round_id}},
          action: { connect: { id: action.id, user_id: action.user_id}},
          card:   { connect: { id: action.card_id}},
        }
      })
      
    }

    // if must be fired, then load this shell
    if (isLethalPayload) {

      // find out if they already have a card loaded
      const alreadyLoaded = await database.actions_Loaded.findFirst({
        where: {
          AND: [
            {  user_id: action.user_id },
            {  game_id: game }
          ]
        },
        include: {
          card: true
        }
      })

      // if they are already loaded
      if (alreadyLoaded) {

        // delete that entry from the actions that are loaded for them
        await database.actions_Loaded.deleteMany({
          where: { 
            AND: [
              { user_id: action.user_id },
              { game_id: game }
            ]
          }
        })

        // find the card state for this user, including the hand and the deck
        const userDeck = await database.game_Card_States.findFirst({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          },
          select: {
            deck: true,
            hand: true
          }
        });

        // find the user-card relationship for the card that they previously played (server expects this to be a User_Card relation when sent from client)
        const card = await database.user_Cards.findFirst({
          where: {
            AND: [
              { user_id: action.user_id },
              { card_id: alreadyLoaded.card_id }
            ]
          }
        });

        let localDeckState: any = userDeck.deck;
        let localHandState: any = userDeck.hand;

        console.log(`Current Deck for user #${action.user_id}: `, localDeckState);
        console.log(`Current Hand for user #${action.user_id}: `, localHandState);

        // add the card back to the deck
        if (Array.isArray(localDeckState)) {
          localDeckState.push(card)
        }

        // filter hand to find the card that we are deleting, and exlcude it
        if (Array.isArray(localHandState)){
          localHandState = localHandState.filter((card) => card.card_id !== action.card_id) // removes the card for this turn from the hand
          console.log(`Card #${action.card_id} has been removed from the hand: `, localHandState);
          localHandState.push(shuffle(localDeckState).pop());                           // push a random card to the hand
        }

        console.log(`Updated Deck for user #${action.user_id}: `, localDeckState);
        console.log(`Updated Hand for user #${action.user_id}: `, localHandState);

        // update the stored deck with parsedDeck being turned back into a string
        const updatesComplete = await database.game_Card_States.updateMany({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          }, 
          data: {
            deck: localDeckState,
            hand: localHandState
          }
        })

        console.log(`Updated card states for user #${action.user_id}: `, updatesComplete);
        
        // create the damage action to store in actions_Loaded
        const damageAction = await database.actions_Loaded.create({
          data: {
            game:   { connect: { id: game}},
            round:  { connect: { id: action.round_id}},
            action: { connect: { id: action.id, user_id: action.user_id}},
            card:   { connect: { id: action.card_id}},
          }
        })

      } else {

        // find the card state for this user, including the hand and the deck
        const userDeck = await database.game_Card_States.findFirst({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          },
          select: {
            deck: true,
            hand: true
          }
        });

        let localDeckState: any = userDeck.deck;
        let localHandState: any = userDeck.hand;

        // filter hand to find the card that we are deleting, and splice it
        if (Array.isArray(localHandState)){
          localHandState = localHandState.filter((card) => card.card_id !== action.card_id) // removes the card for this turn from the hand
          if (localDeckState.length > 0) {
            localHandState.push(shuffle(localDeckState).pop());                         // push a random card to the hand
          }
        }

        // update the stored deck with these changes
        const updatesComplete = await database.game_Card_States.updateMany({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          }, 
          data: {
            deck: localDeckState,
            hand: localHandState
          }
        })

        // create the damage action to store in actions_Loaded
        const damageAction = await database.actions_Loaded.create({
          data: {
            game:   { connect: { id: game}},
            round:  { connect: { id: action.round_id}},
            action: { connect: { id: action.id, user_id: action.user_id}},
            card:   { connect: { id: action.card_id}},
          }
        })
        
      }

    // if this must not be fired, then just add it as an effect
    } else if (isNonLethalPayload) {

      // find the card state for this user, including the hand and the deck
      const userDeck = await database.game_Card_States.findFirst({
        where: {
          AND: [
            { round_id: action.round_id},
            { user_id: action.user_id }
          ]
        },
        select: {
          deck: true,
          hand: true
        }
      });

      let localDeckState: any = userDeck.deck;
      let localHandState: any = userDeck.hand;

      // filter hand to find the card that we are deleting, and splice it
      if (Array.isArray(localHandState)){
        localHandState = localHandState.filter((card) => card.card_id !== action.card_id) // removes the card for this turn from the hand
        if (localDeckState.length > 0) {
          localHandState.push(shuffle(localDeckState).pop());                         // push a random card to the hand
        }
      }

      console.log(`Updated Deck for user #${action.user_id}: `, localDeckState);
      console.log(`Updated Hand for user #${action.user_id}: `, localHandState);

      // update the stored deck with these changes
      const updatesComplete = await database.game_Card_States.updateMany({
        where: {
          AND: [
            { round_id: action.round_id},
            { user_id: action.user_id }
          ]
        }, 
        data: {
          deck: localDeckState,
          hand: localHandState
        }
      })

      const defensiveAction = await database.round_Effects.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: action.round_id}},
          action: { connect: { id: action.id, user_id: action.user_id}},
          card:   { connect: { id: action.card_id}},
        }
      })

      console.log(`commitLoad.ts : 38 | Defensive Card #${defensiveAction.card_id} added as an effect for User #${defensiveAction.user_id} on Game #${defensiveAction.game_id} - Round #${defensiveAction.round_id}.`);

    }

  } catch (error) {
    throw new Error(error);
  }

}