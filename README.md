# Project "Event Horizon"

**An online, turn-based, card battling experience.**

# Project Description

**Event Horizon is Team Code-Blooded's attempt at creating a web application where you can face off against real players in an interactive, turn-based experience. It was heavily inspired by games such as Hearthstone, Slay the Spire, and Faster Than Light.**

# Installation

1. Perform an `npm install` to download dependencies for this project.

2. Initialize your `.env` file with the following variables:
  - DATABASE_LOCAL_URL="mysql://root:@127.0.0.1:3306/${DATABASE_NAME}"
  - DATABASE_NAME='EventHorizon'
  - CLIENT_URL='http://localhost'
  - PORT=3000

3. (OPTIONAL) If you choose to host your database at a remote location, you can store it within your `.env`. In our implementation, we decided to use AWS for hosting our database. An example of how we incorporated this information into our `.env` to be used with Prisma is included below.
  - DATABASE_AWS_USERNAME=''
  - DATABASE_AWS_PASSWORD=''
  - DATABASE_AWS_URL=''
  - DATABASE_AWS_NAME=''
  - DATABASE_AWS_PORT=3306
  - DATABASE_AWS_FULL="mysql://${DATABASE_AWS_USERNAME}:${DATABASE_AWS_PASSWORD}@${DATABASE_AWS_URL}:${DATABASE_AWS_PORT}/${DATABASE_AWS_NAME}"

4. Acquire a Google Client ID, Google Client Secret, and setup Google OAuth within Google Cloud Console. If you aren't familiar with this process, here is relevant [documentation](https://developers.google.com/identity/protocols/oauth2). Ensure that you store this information in your `.env` file.
  - GOOGLE_CLIENT_ID=''
  - GOOGLE_CLIENT_SECRET=''
  - SERVER_SESSION_SECRET=''

5. Under the `OAuth Consent Screen` register your email, as well as other team member emails, as test users. If this isn't done, then you will be refused at the entry point to the application.

6. Once you have registered an `OAuth Consent Screen`, ensure that the `OAuth 2.0 Client IDs` is setup correctly. Ensure that the website is declared as an Authorized Javascript Origin and that you specify Authorized Redirect URIs as necessary.

7. If necessary, update the `auth.js` Passport strategy as necessary. You shouldn't need to update many parts of this if your `.env` file has been setup correctly. An example of how your strategy should be setup is provided [here](https://www.passportjs.org/packages/passport-google-oauth20/).

8. Once the previous steps have been performed, run the command `npx prisma generate`. This will generate a Prisma client to allow for interactions with your mySQL database. If you encounter any errors at this step, review the following notes.

- Ensure that you have mySQL installed on your system; you may need to change privileges or how you access mySQL in order for the Prisma client to communicate with your database.
- Ensure that you have created a database within mySQL through the `CREATE DATABASE` command. The database name should be declared in your `.env`, so that it can be used in your `DATABASE_LOCAL_URL` that the Prisma client will target for database operations.

9. Proceed with this step only if the previous step was successful; after successful generation of the Prisma client run the command `npx prisma migrate dev`. This command will migrate the architecture defined in the `schema.prisma` file to your database in mySQL; this should also work with a remote database. If you encounter any errors at this step, review the notes in the previous section. It might not become apparent that there are issues until you reach this step.

10. If all of the previous steps have been completed successfully, please run the `npm run seed` script to populate the database with some basic cards for you to create a deck and play the game. If this step isn't complete, you will not be able to play a game. A card deck is necessary to enter a game, and as a result there must be cards in the database for you to create a deck.

# Startup

We have developed several Node.js scripts for this project, with the two primary scripts being `npm start` (to start the server) and `npm run build` (to have Webpack transpile JSX). It is important to note that, by design, the server will not start listening on a port and it will not successfully start unless a connection can be established to the database. The `npm run dev` command executes the `npm start` and `npm run build` commands concurrently, which can be useful for development.

```json
{
  "seed": "ts-node server/helpers/misc/seed.ts",
  "build": "webpack",
  "start": "ts-node server/index.ts",
  "test": "concurrently \"npm start\" \"jest\"",
  "dev": "concurrently \"npm start\" \"npm run build\""
}
```

# How It Works

## Frameworks, Libraries, Packages, & Plugins

| Client       | Server    | Database | Miscellaneous |
| ------------ | --------- | -------- | ------------- |
| React        | Node.js   | Prisma   | Jest          |
| React Router | Express   | mySQL    |               |
| Axios        | OAuth 2.0 |          |               |
| Tailwind     | Passport  |          |               |
| Socket.io    | Webpack   |          |               |
|              | Babel     |          |               |
|              | Socket.io |          |               |

### Client

The client uses Webpack with Babel in order to transpile and bundle our components. In order to make our application neat, legible, and user-friendly we have opted to implement Tailwind CSS and React for handling the interface. Axios is used throughout our application to handle requests to our internal server.
  - The `LandingPage` component is the entry point to our application; it entices an unauthenticated user to try the game and allows for them to view certain items.
  - The `Navigation` component interacts with our website to navigate to React routes; this is the primary means by which we change the view in our application.
  - The `Instructions` component uses subcomponents from the Instructions folder to inform the user about the game and how to play it.

After a user is authenticated, their view within the application should change and there are many new routes that are made available to them.
  - The `Instructions` route is made available to the user again.
  - The `Profile` route is made available for the user to modify their profile.
  - The `Play` route is made available for users to find a game and play against opponents.
  - The `Leaderboard` component is not a route but it is used to render a leaderboard. It displays a max of 10 users with the highest score in the game. If you are on that table, your name will flash.

If an authenticated user wishes to modify their profile, then they may do so through the `Profile` component and route.
  - The `Cards` component is a route for users to view their current cards, create decks, and modify existing card decks.
  - The `Settings` component allows for a user to permanently change their username, dark mode preferences, colorblind mode preferences, and SFX volume preferences.
  - The `Friends` component is a route for users to search for and add friends to their friends list. We intended to implement an invite to game feature, but could not do so due to time constraints.
  - The `Leaderboard` component is a route used to render a leaderboard. It displays a max of 10 users with the highest score in the game. If you are on that table, your name will flash.

If an authenticated user wishes to play a game, then they may do so through the `Play` route where they will be prompted to select a card deck. After selecting a card deck, they may click the `Play Now!` button to begin searching for a game. It's important that we explain how this works; if a game exists in the database where only one user has been connected then it will immediately connect a user to the game. If no game is found, then a `Waiting for game...` message will appear until someone else searches for a game. This is very simple logic, but it works. Originally we intended for this feature to enable for you to play against an AI opponent, but the amount of work that this involved exceeded our time constraints.

### Server

Our server imports several items for use, including our authentication strategy and database connection, which is available in the `server/authentication/auth.ts` file and the `server/database/index.ts` file respectively. The server imports these files so that they can be used within an Express instance. Most routes are secured with Passport and the Google OAuth 2.0 strategy, with a few _intended_ exceptions. The server `routes` folder contains all routes associated with specific endpoints.

Whenever a user logs into our application, there are a few things that happen:
  - If an account exists, their account is updated so that we can track their most recent login.
  - If an account does not exist:
    - It creates an account and generates a random name for them as a user.
    - It initializes a settings record for that user.

It's important to note that many of the actual gameplay features and functionalities are not necessarily handled by routes. The majority of our routes are for user interaction, and enable them to see the current cards available in the game as well as their own respective information. Whenever they are in an ongoing game, their actions are passed in on a socket connection between two users. When information is received it is interpreted by the `gameHandler.ts` and its many associated helper functions that exist under `server/helpers`; routes are not used to handle these operations as we wanted this to be handled in real-time and in isolated environments.

### Database

Our database system is mySQL; we decided to select Prisma as our object-relational mapper (ORM) to speed up the development process. Our database architecture has many tables, and some of these tables could likely be optimized further in order to expedite queries. In the section below, we will briefly discuss the purpose of some of the complex tables.

1. Any new game that is created is stored under the `Games` table. Our server routing also does many things for us whenever it creates an entry to the `Games` table.
  - It stores a user connection in the `User_Games` table.
  - It stores the user's selected deck as a JSON in the `Game_Card_States` table.
  - It initializes a starting round in the `Rounds` table.
  - It initializes player information in the `Round_Player_Info` table.

2. Once two players have been established for a `Games` entry (two `User_Games` entries for the game) they will both receive the current `Rounds` entry as well as all player information for the current round (`Round_Player_Info` entries). At this point, they can begin submitting `Actions` which will have a many-to-one relationship with the current `Rounds` entry.

3. Whenever a player submits an `Action` it is passed through the `gameHandler.ts` which will store their action as an entry. Once two `Action` entries exist for a `Round` the `gameHandler.ts` performs a series of complex operations to calculate the damage received and to store information for the subsequent round.

4. Once the `gameHandler.ts` completes these calculations, it will automatically create a new `Round` entry and return that data on the socket to all players. The response that it sends includes all necessary information, including what happened on the previous round as well as every player's current state (health, armor, deck, and hand) to be rendered on the page. This information is vital for gameplay continuity, as well as for rendering effects and providing user feedback.
