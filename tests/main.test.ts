import database from '../server/database/index.ts'
import assignCards from './user/assignCards.ts';
import createUser from './user/createUser';
import deleteUser from './user/deleteUser.ts';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const testUsers = [
  {
    google_id: "testdummy1",
    email: "testdummy1@gmail.com",
    name: "TesterOne"
  },
  {
    google_id: "testdummy2",
    email: "testdummy2@gmail.com",
    name: "TesterTwo"
  },
  {
    google_id: "testdummy3",
    email: "testdummy3@gmail.com",
    name: "TesterThree"    
  }
]

let testUser = testUsers[Math.floor(Math.random() * testUsers.length)];
let exampleUser: any;
let userHasCards: any;

describe('Basic User Functionalities', () => {
  
  beforeAll(async () => {
    // Hook is used to create a user before each test
    exampleUser = await createUser(testUser.google_id, testUser.email, testUser.name);
  });

  afterAll(async () => {
    // Hook deletes a user after each test
    if (exampleUser) {
      await deleteUser(exampleUser.google_id);
    }
  });

  it('Should be able to create a user in the database', async () => {
    expect.assertions(4);
    expect(exampleUser).toBeTruthy();
    expect(exampleUser?.google_id).toBe(testUser.google_id);
    expect(exampleUser?.email).toBe(testUser.email);
    expect(exampleUser?.name).toBe(testUser.name);
  });

  it('Should be able to remove a user from the database', async () => {
    expect.assertions(4);
    const deletedUser = await deleteUser(exampleUser.google_id);
    expect(deletedUser).toBeTruthy();
    expect(deletedUser?.google_id).toBe(testUser.google_id);
    expect(deletedUser?.email).toBe(testUser.email);
    expect(deletedUser?.name).toBe(testUser.name);
    exampleUser = null;
  });
});

describe('Website Functionalities', () => {

  beforeAll(async () => {
    // Hook is used to create a user before each test
    exampleUser = await createUser(testUser.google_id, testUser.email, testUser.name);
    userHasCards = await assignCards(exampleUser.google_id);
  });

  afterAll(async () => {
    // Hook deletes a user after each test
    if (exampleUser) {
      await deleteUser(exampleUser.google_id);
      userHasCards = null;
    }
  });
  
  it('Should have cards that exist in the database', async () => {
    expect.assertions(2);
    const allCards = await axios.get(`${process.env.CLIENT_URL}:${process.env.PORT}/cards`);
    expect(allCards.data.length).toBeGreaterThan(0);
    expect(allCards).toBeTruthy();
  });

  it('Should be able to assign cards to a user on sign-in (Resource Intensive)', async () => {
    expect.assertions(2);
    expect(userHasCards?.length).toBeGreaterThan(0);
    expect(userHasCards).toBeTruthy();
  });

  it('Should allow for a user to create a card deck', async () => {
    expect.assertions(3);

    await axios.post(`${process.env.CLIENT_URL}:${process.env.PORT}/profile/decks/${exampleUser.id}`, {
      data: { 
        deck_name: "User Test Deck",
        cards: userHasCards.map((card: any) => card.id) 
      } 
    })

    const findUserDecks = await database.user_Decks.findFirst({
      where: {
        AND: [
          {user_id: exampleUser.id},
          {deck_name: "User Test Deck"}
        ]
      }
    })

    expect(findUserDecks).toBeTruthy();
    expect(findUserDecks?.deck_name).toBe("User Test Deck");
    expect(findUserDecks?.user_id).toBe(exampleUser.id);
  })

})
