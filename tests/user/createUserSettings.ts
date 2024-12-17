import database from '../../server/database/index.ts'

export default async function createUserSettings(userID: number) {

  try {

    const newUser = database.user_settings.create({
      data: { user_id: userID}
    })

    return newUser;

  } catch (error) {

    console.error(`Failure in test to create new user.`)

  }

}