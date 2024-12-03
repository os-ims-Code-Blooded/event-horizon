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
        where: { user_id: action.user_id}
      })

      let preserveCard;

      if (alreadyLoaded){

        preserveCard = await database.actions_Loaded.findFirst({
          where: { user_id: action.user_id},
          include: {
            card: true
          }
        })

        await database.actions_Loaded.deleteMany({
          where: { user_id: action.user_id }
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
      
      if (preserveCard) { return preserveCard.card };

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