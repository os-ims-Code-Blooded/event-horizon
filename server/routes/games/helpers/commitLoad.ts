import database from "../../../db/index.ts";

export default async function commitLoad(req: any, game: number, action: number){

  try {

    // first find the card that they want to load
    const payload = await database.cards.findFirst({
      where: { id: Number(req.body.data.card_id) }
    })

    /*=====================================================================*/
    const isLethalPayload = (payload.damage > 0 && payload.armor === 0);
    const isNonLethalPayload = (payload.armor > 0 && payload.damage === 0);
    /*=====================================================================*/

    // if must be fired, then load this shell
    if (isLethalPayload) {
      await database.actions_Loaded.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: req.body.data.round_id}},
          action: { connect: { id: action, user_id: Number(req.body.data.user_id)}},
          card:   { connect: { id: payload.id}},
        }
      })
    
    // if this must not be fired, then just add it as an effect
    } else if (isNonLethalPayload) {
      await database.round_Effects.create({
        data: {
          game:   { connect: { id: game}},
          round:  { connect: { id: req.body.data.round_id}},
          action: { connect: { id: action, user_id: Number(req.body.data.user_id)}},
          card:   { connect: { id: payload.id}},
        }
      })
    }

  } catch (error) {
    console.error(`Error on commitLoad: `, error);
    return error;
  }

}