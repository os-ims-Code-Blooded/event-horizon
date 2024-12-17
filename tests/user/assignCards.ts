import database from '../../server/database/index.ts';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

export default async function assignCards(googleID: string){

  try {

    const findUser = await database.user.findFirst({
      where: { google_id: googleID}
    })

    await axios.post(`${process.env.CLIENT_URL}:${process.env.PORT}/profile/collections/${findUser?.id}`);

    const userHasCards = await database.user_cards.findMany({
      where: { user_id: findUser?.id}
    })

    return userHasCards;

  } catch (error) {

    console.error(`Failure in test to assign cards to new user.`)

  }

}