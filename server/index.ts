import express, { Request, Response } from 'express';
import { User, AuthRequest } from './helpers/misc/types.ts';
import passport from 'passport';
import session  from 'express-session';
import authRouter from './authentication/auth.ts';
import path from 'path';
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import database from './database/index.ts';
import https from 'https';
import http from 'http';
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import profile from './routes/user/profile.ts';
import friends from './routes/user/friends.ts';
import games from './routes/games/games.ts';
import gameHandler from './gameHandler.ts';
import cards from './routes/cards/cards.ts';
import errorHandler from './helpers/misc/error_logging/errorHandler.ts';
import closeStagnantGames from './helpers/misc/closeStagnantGames.ts';
import fs from 'fs';


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
let server;

//creates an io server using the http server made with the express server

const URL = process.env.TRUE_URL ? process.env.TRUE_URL : `${CLIENT_URL}:${PORT}`

if (process.env.TRUE_URL) {
  const privateKey = path.resolve(__dirname, '/live/eventhorizongame.live/privkey.pem');
  const certificate = path.resolve(__dirname, '/live/eventhorizongame.live/cert.pem');
  /*

  1. Configured NGINX
  2. Verified that sockets are targeting HTTPS (changed socket.io connection to WSS)

  https://localhost:3000
  https://localhost:3000/auth/google/callback
  https://localhost:3000/login
  https://eventhorizongame.live
  https://eventhorizongame.live/auth/google/callback
  https://eventhorizongame.live/login
  https://www.eventhorizongame.live
  https://www.eventhorizongame.live/auth/google/callback
  https://www.eventhorizongame.live/login  
  */

  if (privateKey && certificate) {
    server = https.createServer({
      key: fs.readFileSync(privateKey, 'utf8'),
      cert: fs.readFileSync(certificate, 'utf8'),
    }, app);
  } else {
    errorHandler(new Error('Could not find privateKey or certificate. The paths are invalid or these have expired.'))
    server = https.createServer(app);
  }
} else {
  server = http.createServer(app);
}

const io = new Server(server, {
  cors: {
    origin: `${URL}`,
    methods: ["GET", "POST"],
    credentials: true,
  }
})

server.listen(PORT, () => {
    database.$connect()
        .then((connectionEstablished) => {
          console.log(`Prisma has connected to the database...`);
          console.log("Server listening on: ",CLIENT_URL + ':' + PORT);
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

  const halfHour = 60 * 30 * 1000; 
  const fiveMinutes = 60 * 5 * 1000;

  setInterval( async () => {
    try {
      const deletedGames = await database.games.deleteMany({ where: { status: false }})
      if (deletedGames) {
        console.log(`Routine database maintenance: purged ${deletedGames.count} closed games in database at ${new Date()}.`)
      }
    } catch (error) {
      errorHandler(error);
      console.error(`Error during routine database maintenance: failure to purge closed games: `, error);
    }
  }, halfHour);

  // setInterval ( async () => {
  //   try {
  //     const updates = await closeStagnantGames();
  //     updates.forEach((update) => {
  //       io.in(`${update.id}`).emit('game_over', { GameComplete: update })
  //     })
  //   } catch (error) {
  //     errorHandler(error);
  //     console.error(`Error on interval force closure of stagnant games: `, error);
  //   }
  // }, fiveMinutes)

  //when the server establishes a connection, it shall do the following:
  interface ConnectedUsers {
    [userId: string]: string;
  }
const connectedUsers: ConnectedUsers = {};

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
      const findPlayerInfo = await database.game_player_information.findMany({
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

    // console.log(" ENDED TURN DATA ", data)

    try {
      const response = await gameHandler(data)
      io.in(data.session).emit('received_rounds_data', response)
    }
    catch(error){
      errorHandler(error);
      console.error(error)
    }

  })


// PLAYER SELF-DESTRUCTS
  socket.on('game_over', (data, session)=>{
    console.log("data", data)
      io.in(session).emit('game_over', data)

  })

// USER GAME INVITE


  socket.on('register_user', (userId) => {
    connectedUsers[String(userId)] = socket.id;
    socket.join(userId);
    console.log(`User: ${userId} added to connectedUsers`, connectedUsers);
  });

  socket.on('send_invite', (data, invited) => {
    const invitedBy = connectedUsers[String(data.from)];
    const invitedSock = connectedUsers[String(invited)];
    console.log('invitedSock Id', invitedSock)
    if (invitedSock) {
      io.to([invitedSock, invitedBy]).emit('incoming_invite', data);
      // console.log(`Invite sent to user: ${invited}`);
    } else {
      console.log(`User ${invited} is not connected.`);
    }
  });

  socket.on('disconnect', () => {
    users = users.filter(user=>user!==sockId)
    players = users.length;


    for (const user in connectedUsers){
      if(connectedUsers[user] === sockId){
        delete connectedUsers[user];
      }
    };
  });

});


