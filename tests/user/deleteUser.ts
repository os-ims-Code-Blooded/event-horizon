import database from '../../server/database/index.ts'

export default async function deleteUser(googleID: string){

  try {

    const deletedUser = database.user.delete({
      where: { google_id: googleID }
    })

    return deletedUser;

  } catch (error) {

    console.error(`Failure in test to delete a new user.`)

  }

}