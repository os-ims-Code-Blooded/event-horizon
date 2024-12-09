import database from "../database/index.ts";

export default async function createAction(req: any){
  
  try {

    const cardSubmission = req.body.data.card_id ? req.body.data.card_id : null;

    if (cardSubmission){

      // this vets and verifies that the player currently possesses the card that they are attempting to play
      const findCardCorrelation = await database.user_Cards.findFirst({ 
        where: { id: Number(req.body.data.card_id) },
        select: { card_id: true }
      })

      // we create and store this action for later calculations
      const newAction = await database.actions.create({
        data: {
          round:  { connect: { id: req.body.data.round_id}},
          user:   { connect: { id: req.body.data.user_id}},
          card:   { connect: { id: findCardCorrelation.card_id }},
          action: req.body.data.action,
          expedite: req.body.data.expedite
        }
      })

      // we return it if necessary for immediate use
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
    throw new Error(error);
  }
}