import database from "../../../db/index.ts";
import shuffle from "./shuffle.ts";

export default async function commitLoad(req: any, game: number, action: any){

  try {

    // first find the card that they want to load
    const payload = await database.cards.findFirst({
      where: { id: Number(action.card_id) }
    })

    /*=====================================================================*/
    const isLethalPayload = (payload.damage > 0 && payload.armor === 0);
    const isNonLethalPayload = (payload.armor > 0 && payload.damage === 0);
    /*=====================================================================*/

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
          localHandState = localHandState.filter((card) => card.card_id !== payload.id) // removes the card for this turn from the hand
          console.log(`Card #${payload.id} has been removed from the hand: `, localHandState);
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
            card:   { connect: { id: payload.id}},
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

        console.log(`Current Deck for user #${action.user_id}: `, localDeckState);
        console.log(`Current Hand for user #${action.user_id}: `, localHandState);

        // filter hand to find the card that we are deleting, and splice it
        if (Array.isArray(localHandState)){
          localHandState = localHandState.filter((card) => card.card_id !== payload.id) // removes the card for this turn from the hand
          console.log(`Card #${payload.id} has been removed from the hand: `, localHandState);
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

        console.log(`Updated card states for user #${action.user_id}: `, updatesComplete);

        // create the damage action to store in actions_Loaded
        const damageAction = await database.actions_Loaded.create({
          data: {
            game:   { connect: { id: game}},
            round:  { connect: { id: action.round_id}},
            action: { connect: { id: action.id, user_id: action.user_id}},
            card:   { connect: { id: payload.id}},
          }
        })
        
      }

    // if this must not be fired, then just add it as an effect
    } else if (isNonLethalPayload) {

      console.log(`commitLoad.ts : 34 | Loading defensive Card #${payload.id} for User #${action.user_id} on Game #${game} - Round #${action.round_id}.`);

      const defensiveAction = await database.round_Effects.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: action.round_id}},
          action: { connect: { id: action.id, user_id: action.user_id}},
          card:   { connect: { id: payload.id}},
        }
      })

      console.log(`commitLoad.ts : 38 | Defensive Card #${defensiveAction.card_id} added as an effect for User #${defensiveAction.user_id} on Game #${defensiveAction.game_id} - Round #${defensiveAction.round_id}.`);

    }

  } catch (error) {
    console.error(`Error on commitLoad: `, error);
    return error;
  }

}