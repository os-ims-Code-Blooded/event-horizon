import database from "../../../db/index.ts";

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

      console.log(`commitLoad.ts : 18 | Loading offensive Card #${payload.id} for User #${action.user_id} on Game #${game} - Round #${action.round_id}.`);

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


      if (alreadyLoaded) {

        await database.actions_Loaded.deleteMany({
          where: { user_id: action.user_id }
        })

        console.log(`A card was already loaded for user #${action.user_id}, the card was: `, alreadyLoaded.card);

        // find the card state for this user
        const userDeck = await database.game_Card_States.findFirst({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          },
          select: {
            deck: true
          }
        })

        // find the user-card relationship for the card that they played (server expects this to be a User_Card relation when sent from client)
        const card = await database.user_Cards.findFirst({
          where: {
            AND: [
              { user_id: action.user_id },
              { card_id: alreadyLoaded.card_id }
            ]
          }
        })

        const localDeckState: any = userDeck.deck;

        if (Array.isArray(localDeckState)) {
          localDeckState.push(card)
        }

        // update the stored deck with parsedDeck being turned back into a string
        await database.game_Card_States.updateMany({
          where: {
            AND: [
              { round_id: action.round_id},
              { user_id: action.user_id }
            ]
          }, 
          data: {
            deck: localDeckState
          }
        })

      }

      const damageAction = await database.actions_Loaded.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: action.round_id}},
          action: { connect: { id: action.id, user_id: action.user_id}},
          card:   { connect: { id: payload.id}},
        }
      })

      console.log(`commitLoad.ts : 22 | Offensive Card #${damageAction.card_id} loaded for User #${damageAction.user_id} on Game #${damageAction.game_id} - Round #${damageAction.round_id}.`);

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