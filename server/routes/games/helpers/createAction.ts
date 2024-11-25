import database from "../../../db/index.ts";

export default async function createAction(req: any){
  const cardSubmission = req.body.data.card_id ? req.body.data.card_id : null;

  try {
    if (cardSubmission){
  
      const cardDetails = await database.cards.findFirst({ where: { id: Number(req.body.data.card_id)}})
  
      const newAction = await database.actions.create({
        data: {
          round:  { connect: { id: req.body.data.round_id}},
          user:   { connect: { id:req.body.data.user_id}},
          card:   { connect: { id:cardDetails.id}},
          action: req.body.data.action,
        }
      })

      return newAction;
  
    } else {
      const newAction = await database.actions.create({
        data: {
          round:  { connect: { id: req.body.data.round_id}},
          user:   { connect: { id:req.body.data.user_id}},
          action:   req.body.data.action,
        }
      })

      return newAction;
    }
  } catch (error) {
    console.error(`Fatal error in createAction helper: `, error);
    return error;
  }
}