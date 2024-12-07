import database from "../../../db/index.ts";

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
      console.log(`calculateEffects.ts : 13 | No active effects found for User #${user} on Game #${game}.`);
      return null;
    }

    const effects = {
      damage: 0,
      armor: 0
    };

    console.log(`calculateEffects.ts : 18 | Effects subcalculations initialized for User #${user} on Game #${game}.`);

    activeEffects.forEach( async (effect) => {

      // if effect has expired, delete the effect
      if (effect.time_elapsed >= effect.duration){
        console.log(`calculateEffects.ts : 25 | Effect #${effect.id} with Card #${effect.card_id} has expired.`);
        await database.round_Effects.delete({ where: {id: effect.id} })

      // else increment effect
      } else {
        console.log(`calculateEffects.ts : 25 | Processing Effect #${effect.id} with Card #${effect.card_id} found for User #${user} on Game #${game}.`);
        effects.damage += effect.damage;
        effects.armor += effect.armor;
        await database.round_Effects.update({
          where: {id: effect.id},
          data: {time_elapsed: effect.time_elapsed + 1}
        })
      }

    })

    console.log(`calculateEffects.ts : 31 | Effects for User #${user} have been processed, results are: `, effects);

    return effects;

  } catch (error) {
    console.error(`Error on commitLoad: `, error);
    return error;
  }

}