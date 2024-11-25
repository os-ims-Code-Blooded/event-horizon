import database from "../../../db/index.ts";

export default async function calculateEffects(game: any, user: any){

  try {

    const effects = {
      damage: 0,
      armor: 0
    };

    // find all active effects for user
    const activeEffects = await database.round_Effects.findMany({
      where: { user_id: user }
    })

    if (!activeEffects) {
      return null;
    }

    activeEffects.forEach((effect) => {
      effects.damage += effect.damage;
      effects.armor += effect.armor;
    })

    return effects;

  } catch (error) {
    console.error(`Error on commitLoad: `, error);
    return error;
  }

}