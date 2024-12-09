import database from "../../../db/index.ts";

export default async function commitAttack(req: any, game: number, action: any){

  try {

    // first find the loaded card that they want to fire
    const payload = await database.actions_Loaded.findFirst({
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

      console.log(`commitAttack.ts : 14 | Found loaded Card #${payload.card_id} with an effect for User #${action.user_id} on Game #${game}.`);
    
      // save the damage for calculations
      const damage = payload.damage;

      console.log(`commitAttack.ts : 22 | Card #${payload.card_id} will do ${damage}-damage on behalf of User #${action.user_id} on Game #${game}.`);
      
      // create it as an effect
      const newEffect = await database.round_Effects.create({
        data: {
          round:    { connect: { id: req.body.data.round_id}},
          game:     { connect: { id: game }},
          card:     { connect: { id: payload.card_id}},
          action:   { connect: { id: action.id, user_id: Number(action.user_id)}},
        }
      })

      console.log(`commitAttack.ts : 27 | Card #${payload.card_id} stored under Effect #${newEffect.id} for User #${action.user_id} on Game #${game}.`);

      // remove the item from the loaded armaments
      await database.actions_Loaded.delete({
        where: { id: payload.id }
      })

      console.log(`commitAttack.ts : 39 | Unloading Card #${payload.card_id} for User #${action.user_id} on Game #${game}.`);

      return damage;

    } else if (payloadExists) {

      console.log(`commitAttack.ts : 13 | Found loaded Card #${payload.card_id} for User #${action.user_id} on Game #${game}.`);

      // save the damage for calculations
      const damage = payload.damage;

      console.log(`commitAttack.ts : 46 | Card #${payload.card_id} will do ${damage}-damage on behalf of User #${action.user_id} on Game #${game}.`);

      // remove the item from the loaded armaments
      await database.actions_Loaded.delete({
        where: { id: payload.id }
      })

      console.log(`commitAttack.ts : 57 | Unloading Card #${payload.card_id} for User #${action.user_id} on Game #${game}.`);

      return damage;

    } else {
      
      console.log(`commitAttack.ts : 13 | No loaded Card found for User #${action.user_id} on Game #${game}.`);
      return 5; // basic attack

    }

  } catch (error) {
    throw new Error(error);
  }

}