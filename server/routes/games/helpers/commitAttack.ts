import database from "../../../db/index.ts";

export default async function commitAttack(req: any, game: number, action: number){

  try {

    // first find the loaded card that they want to fire
    const payload = await database.actions_Loaded.findFirst({
      where: { user_id: Number(req.body.data.user_id) }
    })

    /*=====================================================================*/
    const payloadExists = payload ? payload: null;
    const payloadHasEffect = payload ? (payload.duration > 0) : null;
    /*=====================================================================*/

    if (payloadHasEffect) {
    
      // save the damage for calculations
      const damage = payload.damage;
      
      // create it as an effect
      await database.round_Effects.create({
        data: {
          round:    { connect: { id: req.body.data.round_id}},
          game:     { connect: { id: game }},
          card:     { connect: { id: req.body.data.card_id}},
          action:   { connect: { id: action, user_id: Number(req.body.data.user_id)}},
        }
      })

      // remove the item from the loaded armaments
      await database.actions_Loaded.delete({
        where: { id: payload.id }
      })

      return damage;

    } else if (payloadExists) {

      // save the damage for calculations
      const damage = payload.damage;

      // remove the item from the loaded armaments
      await database.actions_Loaded.delete({
        where: { id: payload.id }
      })

      return damage;

    } else {
      
      return 5; // basic attack

    }

  } catch (error) {
    console.error(`Error on commitLoad: `, error);
    return error;
  }

}