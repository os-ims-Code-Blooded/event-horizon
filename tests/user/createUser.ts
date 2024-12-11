import database from '../../server/database/index.ts'

export default async function createUser(googleID: string, email: string, name: string){

  try {

    const newUser = database.user.create({
      data: {
        google_id: googleID,
        email: email,
        name: name
      }
    })

    return newUser;

  } catch (error) {

    console.error(`Failure in test to create new user.`)

  }

}