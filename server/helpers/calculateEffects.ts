import database from "../database/index.ts";

export default async function calculateEffects(game: any, user: number){

  try {

    // find all active effects for user
    const activeEffects = await database.round_Effects.findMany({
      where: { 
        AND: [
          { user_id: user },
          { game_id: game }
        ]
      }
    })
    

    if (!activeEffects || activeEffects.length === 0) {
      return null;
    }

    const effects = {
      damage: 0,
      armor: 0
    };

    activeEffects.forEach( async (effect) => {

      // if effect has expired, delete the effect
      if (effect.time_elapsed >= effect.duration){
        await database.round_Effects.delete({ where: {id: effect.id} })

      // else increment effect
      } else {
        effects.damage += effect.damage;
        effects.armor += effect.armor;
        await database.round_Effects.update({
          where: {id: effect.id},
          data: {time_elapsed: effect.time_elapsed + 1}
        })
      }

    })

    return effects;

  } catch (error) {
    throw new Error(error);
  }

}