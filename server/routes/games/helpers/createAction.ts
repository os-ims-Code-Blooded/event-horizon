import database from "../../../db/index.ts";

export default async function createAction(req: any){
  
  try {

    const cardSubmission = req.body.data.card_id ? req.body.data.card_id : null;

    if (cardSubmission){
      const findCardCorrelation = await database.user_Cards.findFirst({ where: { id: Number(req.body.data.card_id) }})
      
      const cardDetails = await database.cards.findFirst({ where: { id: findCardCorrelation.card_id}})

      const newAction = await database.actions.create({
        data: {
          round:  { connect: { id: req.body.data.round_id}},
          user:   { connect: { id: req.body.data.user_id}},
          card:   { connect: { id: cardDetails.id}},
          action: req.body.data.action,
        }
      })

      //============================ NEW CODE =======================//
      /**
       *  this code expects for a submitted action (each user) to
       *  provide a string JSON of their current deck under property 
       *  'deck' when they submit an action
       */ 
      await database.game_Card_States.updateMany({
        where: {
          AND: [
            { round_id: req.body.data.round_id },
            { user_id: req.body.data.user_id}
          ]
        },
        data: {
          deck: req.body.data.deck
        }
      })
      //=============================================================//

      console.log(`createAction.ts : 11 | New action for User #${newAction.user_id} on Round #${newAction.round_id}; includes card #${newAction.card_id} with action type '${newAction.action}'.`);
      return newAction;
  
    } else {
      const newAction = await database.actions.create({
        data: {
          round:  { connect: { id: req.body.data.round_id}},
          user:   { connect: { id: req.body.data.user_id}},
          action:   req.body.data.action,
        }
      })

      console.log(`createAction.ts : 11 | New action for User #${newAction.user_id} on Round #${newAction.round_id}; action type '${newAction.action}'.`);
      return newAction;
    }
  } catch (error) {
    console.error(`Fatal error in createAction helper: `, error);
    return error;
  }
}