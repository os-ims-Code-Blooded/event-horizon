import database from '../../server/database/index.ts'

export default async function createDeck(googleID: string){

  try {

    // const newUser = database.user.create({
    //   data: {
    //     google_id: googleID,
    //     email: email,
    //     name: name
    //   }
    // })

    // return newUser;

  } catch (error) {

    console.error(`Failure in test to create a deck for a new user.`)

  }

}