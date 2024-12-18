import database from "../database/index.ts";
import calculateEffects from "./calculateEffects.ts";
import commitAttack from "./commitAttack.ts";
import commitLoad from "./commitLoad.ts";

export default async function calculateGameState(req: any, game: number) {

  try {

    const action_results: any = {};

    // get all actions for the round specified in params
    const allRoundactions = await database.actions.findMany({
      where: { round_id: req.body.data.round_id},
      include: { card: true }
    })

    // initialize results for each user in game
    allRoundactions.forEach((action) => {
      action_results[action.user_id] = {};
      action_results[action.user_id].armor = 0;
      action_results[action.user_id].damage = 0;
      action_results[action.user_id].isBlocking = false;
    })
    // for every user in action results
    for (const key in action_results) {

      // calculate effects
      const effects = await calculateEffects(game, Number(key));
      
      if (effects) {
        action_results[key]['damage'] += effects.damage;
        action_results[key]['armor'] += effects.armor;
      }
    }

    // for every action on the current round
    for (let i = 0; i < allRoundactions.length; i++){

      const action = allRoundactions[i].action;
      const user = allRoundactions[i].user_id;
      const card = allRoundactions[i].card_id;

      if (action === 'FIRE'){

        const attackDamage = await commitAttack(req, game, allRoundactions[i]); // Attacks always return a damage number value
        action_results[user]['damage'] += attackDamage;

      } else if (action === 'LOAD'){

        if (!card) {
          throw new Error (`Invalid LOAD operation; no card specified.`)
        } else {
          await commitLoad(req, game, allRoundactions[i]);
        }

      } else if (action === 'BLOCK'){
        action_results[user]['isBlocking'] = true;
      } else {
        throw new Error(`Invalid argument for action type; check syntax on request.`)
      }

    }

    return action_results;

  } catch (error) {
    throw new Error(error);
  }

}