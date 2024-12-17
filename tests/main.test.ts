import database from '../server/database/index.ts'
import assignCards from './user/assignCards.ts';
import createUser from './user/createUser';
import deleteUser from './user/deleteUser.ts';
import axios from 'axios';
import dotenv from "dotenv";
import createUserSettings from './user/createUserSettings.ts';
//? import * as $ from 'jquery';

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
    await createUserSettings(exampleUser.id)
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
    expect(exampleUser?.name === testUser.name || exampleUser?.name === "Baron von Steuben").toBe(true);
  });

  it('Should be able to update user settings in the database', async () => {
    expect.assertions(1);
    await axios.patch(`${process.env.CLIENT_URL}:${process.env.PORT}/profile/settings/${exampleUser.id}`, {
      data: { "dark_mode": true }
    })

    const userSettings = await database.user_settings.findFirst({
      where: { user_id: exampleUser.id }
    })

    expect(userSettings?.dark_mode).toBeTruthy();
  })

  it('Should be able to update user information in the database', async () => {
    expect.assertions(1);
    await axios.patch(`${process.env.CLIENT_URL}:${process.env.PORT}/profile/${exampleUser.id}`, { "name": "Baron von Steuben"})

    const user = await database.user.findFirst({
      where: { id: exampleUser.id }
    })

    expect(user?.name).toBe("Baron von Steuben" );
  })

});

describe('Website Functionalities', () => {

  it('Should render the landing page at the entry point', async () => {

  })

})

describe('API Functionalities', () => {

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

    const findUserDecks = await database.user_decks.findFirst({
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