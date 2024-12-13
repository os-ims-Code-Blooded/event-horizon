import database from "../database/index.ts";

export default async function createAction(req: any){
  
  try {

    const cardSubmission = req.body.data.card_id ? req.body.data.card_id : null;

    if (cardSubmission){

      // this vets and verifies that the player currently possesses the card that they are attempting to play
      const findCardCorrelation = await database.user_Cards.findFirst({ 
        where: { id: Number(req.body.data.card_id) },
        include: { card: true }
      })

      let newAction;
      // we create and store this action for later calculations

      if (req.body.data.expedite){
        console.log(`Received an expedited request from client; card supplied by client was #${req.body.data.card_id} with no translation required.`)
        newAction = await database.actions.create({
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            card:   { connect: { id: req.body.data.card_id }},
            action: req.body.data.action,
            expedite: req.body.data.expedite
          }
        })
      } else {
        console.log(`Received a normal request from client; card supplied by client was #${req.body.data.card_id} => #${findCardCorrelation.card.id}`)
        newAction = await database.actions.create({
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            card:   { connect: { id: findCardCorrelation.card.id }},
            action: req.body.data.action,
          }
        })        
      }


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

      return newAction;
    }
  } catch (error) {
    throw new Error(error);
  }
}