import express, { Request, Response } from 'express';
import { User, AuthRequest } from './misc/types.ts';
import passport from 'passport';
import session  from 'express-session';
import authRouter from './auth/auth.ts';
import path from 'path';
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import database from './db/index.ts';
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { it } from 'node:test';
import profile from './routes/user/profile.ts';
import friends from './routes/user/friends.ts';
import games from './routes/games/games.ts';
import gameHandler from './gameHandler.ts';
import cards from './routes/cards/cards.ts';
import errorHandler from './misc/errorHandler.ts';

// const {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices} = require('./../utils/players')
// const { sessions, makeSession, joinSession, exitSession } = require('./../utils/sessions')

//configure dotenv
dotenv.config();

//start express instance
const app = express();

const PORT: String = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

////////// MIDDLEWARE /////////////////
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/dist/')));
app.on('error', (err: any) => console.error('Error', err));
app.use(cors())



////////// PASSPORT //////////////////
app.use(session(
  {
    secret: process.env.SERVER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }
));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);
app.use('/profile', profile);
app.use('/friends', friends);
app.use('/games', games);
app.use('/cards', cards)

// Middleware to check if user is authenticated
const isAuthenticated = (req: AuthRequest, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};


app.get('/', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

// app.get('*', (req: AuthRequest, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/dist/index.html'))
// })

app.get('/title-menu', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/instructions', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/user-profile', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/friends', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})

app.get('/api/auth-check/', async (req: AuthRequest, res) => {

  // there is a better way to do this section
    // right now this is fetching the user from the database on every auth check
    // it would be better for us to simply return whether or not the user exists on the request

    // req.isAuthenticated() ? true : false
    // OR
    // req.user ? true : false

    // we would send this information back to the client and if TRUE they stay in the App
    // otherwise we would send back FALSE and they would be redirected
    
  let user;

  if (req.user) {
    user = await database.user.findFirst({
      where: { id: Number(req.user.id)}
    })
  }

  res.json({ isAuthenticated: req.isAuthenticated(), user: user });
});

app.get('/game-board', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/leaderboard', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/cards', (req: AuthRequest, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/settings', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})

app.post('/api/logout', (req: AuthRequest, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((error) => {
      if (error) {
        errorHandler(error);
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.status(200).json({ message: 'Logged out!' });
    });
  });
});


////////// ROUTERS //////////////////




//////// WEBSOCKET ///////////////////////////

//makes an http server with the express server
const server = http.createServer(app)

//creates an io server using the http server made with the express server
//I don't know why
const io = new Server(server, {
  //some kind of cors options object, idk
  cors: {
    origin: `${CLIENT_URL}:${PORT}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // cors: {
  //   origin: `${CLIENT_URL}:${PORT}`,
  //   methods: ["GET", "POST"],
  //   credentials: true,
  // },
})
//............./////////////...........................
//trying some crap out

//............./////////////...........................
server.listen(PORT, () => {
    database.$connect()
        .then((connectionEstablished) => {
          console.log(`Prisma has connected to the database...`);
          console.log("Server listening on Port",CLIENT_URL + ':' + PORT);
        })
        .catch((error) => {
          errorHandler(error);
          console.error(`Failure on database connection...`)
        })
});


  let messages : any = [];
  let users: any[] = []
  let sessionNum = 0;
  let players = 0;

  let roundNum = 0
  let gameMoves = []
  let oneUserEndedTurn = true

  const oneHour = 60 * 60 * 1000; 

  setInterval( async () => {
    try {
      const deletedGames = await database.games.deleteMany({ where: { status: false }})
      if (deletedGames) {
        console.log(`Routine database maintenance: purged closed games in database at ${new Date()}.`)
      }
    } catch (error) {
      errorHandler(error);
      console.error(`Error during routine database maintenance: failure to purge closed games: `, error);
    }
  }, oneHour);

  //when the server establishes a connection, it shall do the following:


io.on('connection', (socket)=>{



  // console.log(`user connected: ${socket.id}`)
  // console.log("\n \n**********SOCKET:************ \n \n", socket)
  let sockId = socket.id

  users.push(sockId)
  // console.log("USERS:", users)

  players = users.length;
  // console.log("CURRENT PLAYERS CONNECTED:", players)



  //listening for a join room event
  socket.on('join_session', async (data, user, roundNum) => {
    
    try {

      console.log(`===================================================================`)
      console.log("SOCKET CONNECTION  |  ", sockId)
      console.log(data, user)
      console.log(`===================================================================\n`)
  
      socket.join(data)

      // finds player information for all players currently in-game
      const findPlayerInfo = await database.round_Player_Info.findMany({
        where: { round_id: Number(roundNum)},
      })

      if (findPlayerInfo.length > 1) {
        console.log(`===================================================================`)
        console.log(`Two players have been detected for Game Session #${data}.`)
        console.log(`The Game Board should be rendered by the client for the session.`)
        console.log("FOUND PLAYER INFO:  ", findPlayerInfo);
        console.log(`===================================================================\n`)
      }

      io.in(data).emit("session_players", findPlayerInfo);

    } catch (error) {
      errorHandler(error);
      console.log(`<<!!!!=========================ERROR=========================!!!!>>`)
      console.error(`Error in JOIN SESSION for ${sockId} on ${roundNum}.`)
      console.log(`<<!!!!=======================================================!!!!>>`)
    }

  })


/////////////////////////////////////////////
  //PLAYER ENDS TURN

  socket.on('end_turn', async (data)=>{

    console.log(" ENDED TURN DATA ", data)

    try {
      const response = await gameHandler(data)
      io.in(data.session).emit('received_rounds_data', response)
    }
    catch(error){
      errorHandler(error);
      console.error(error)
    }

  })

////////////////////////////////////////
// PLAYER SELF-DESTRUCTS
  socket.on('game_over', (data, session)=>{
    console.log("data", data)
      io.in(session).emit('game_over', data)

  })
//////////////////////////////////////////
  //when a user disconnects
  socket.on('disconnect', () => {
    // console.log('user disconnected');

    users = users.filter(user=>user!==sockId)
    // console.log("USERS:", users)

    players = users.length;
    // console.log("CURRENT PLAYERS CONNECTED:", players)

  });

})

///////////////////////////////////////////
