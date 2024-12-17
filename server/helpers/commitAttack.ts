import database from "../database/index.ts";

export default async function commitAttack(req: any, game: number, action: any){

  try {

    // first find the loaded card that they want to fire
    const payload = await database.actions_loaded.findFirst({
      where: {
        user_id: Number(action.user_id),
        game_id: game
      }
    })
    
    /*=====================================================================*/
    const payloadExists = payload ? payload: null;
    const payloadHasEffect = payload ? (payload.duration > 0) : null;
    /*=====================================================================*/

    if (payloadHasEffect) {
    
      // save the damage for calculations
      const damage = payload.damage;
      
      // create it as an effect
      const newEffect = await database.round_effects.create({
        data: {
          round:    { connect: { id: req.body.data.round_id}},
          game:     { connect: { id: game }},
          card:     { connect: { id: payload.card_id}},
          action:   { connect: { id: action.id, user_id: Number(action.user_id)}},
        }
      })

      // remove the item from the loaded armaments
      await database.actions_loaded.delete({
        where: { id: payload.id }
      })

      return damage;

    } else if (payloadExists) {

      // save the damage for calculations
      const damage = payload.damage;

      // remove the item from the loaded armaments
      await database.actions_loaded.delete({
        where: { id: payload.id }
      })

      return damage;

    } else {
      return 5; // basic attack
    }

  } catch (error) {
    throw new Error(error);
  }

}