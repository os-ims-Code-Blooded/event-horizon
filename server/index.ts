import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from "dotenv";

import database from './db/index.ts';

import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { it } from 'node:test';
import profile from './routes/user/profile.ts';
import games from './routes/games/games.ts';
import cards from './routes/cards/cards.ts';
// const {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices} = require('./../utils/players')
// const { sessions, makeSession, joinSession, exitSession } = require('./../utils/sessions')


//configure dotenv
dotenv.config();

//start express instance
const app = express();

const PORT: String = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;


////////// ROUTERS //////////////////



////////// MIDDLEWARE /////////////////
app.use(express.json());
app.use('/profile', profile);
app.use('/games', games);
app.use('/cards', cards);
app.use(express.static(path.resolve(__dirname, '../client/dist/')));
app.on('error', (err: any) => console.error('Error', err));
app.use(cors())

//////// WEBSOCKET ///////////////////////////

//makes an http server with the express server
const server = http.createServer(app)

//creates an io server using the http server made with the express server
//I don't know why
const io = new Server(server, {
  //some kind of cors options object, idk
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
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

  //when the server establishes a connection, it shall do the following:


io.on('connection', (socket)=>{



  console.log(`user connected: ${socket.id}`)
  // console.log("\n \n**********SOCKET:************ \n \n", socket)
  let sockId = socket.id

  users.push(sockId)
  // console.log("USERS:", users)

  players = users.length;
  // console.log("CURRENT PLAYERS CONNECTED:", players)



  //listening for a join room event
  socket.on('join_session', data=>{

    // console.log("SESSION DATA", data)
    // console.log("SOCKET ID:", sockId)

      socket.join(data)
      socket.to(data.session).emit(messages)



    //connects the socket object to the incoming room data
  })





  //PLAYER ENDS TURN

  socket.on('block_end_turn', data=>{

    console.log("ACTION DATA", sockId, data.playerAction)
    console.log("CARD DATA", sockId, data.cardToPlay)
    console.log("TURN ENDED?", sockId, data.turnEnded )

    socket.to(data.session).emit("receive_action", data.playerAction)

    if (data.cardToPlay){
      socket.in(data.session).emit("receive_card", data.cardToPlay)
    }
  })









  socket.on('fire_end_turn', data=>{


    console.log("ACTION DATA", sockId, data.playerAction)
    console.log("CARD DATA", sockId, data.cardToPlay)


    socket.to(data.session).emit("receive_action", data.playerAction)
  })









  socket.on('load_end_turn', data=>{

    console.log("ACTION DATA", sockId, data.playerAction)
    console.log("CARD DATA", sockId, data.cardToPlay)

    socket.to(data.session).emit("receive_action", data.playerAction)

    if (data.cardToPlay){
      socket.in(data.session).emit("receive_card", data.cardToPlay)
    }
  })


  socket.on('lame_end_turn', data=>{

    console.log("ACTION DATA", sockId, data.playerAction)
    socket.to(data.session).emit("receive_action", data.playerAction)

  })

  // socket.on('end_turn', data=>{

  //   console.log("ACTION DATA", data.playerAction)
  //   console.log("CARD DATA", data.cardToPlay)


  //   socket.to(data.session).emit("receive_action", data.playerAction)

  //   if (data.cardToPlay){
  //     socket.in(data.session).emit("receive_card", data.cardToPlay)
  //   }


  // })









  //////////////////////////////////////////

    // //if it receives data marked send_message
    // socket.on('send_message', (data)=>{

    //   // console.log("MESSAGE DATA", data)
    //   // console.log("SOCK ID", sockId)

    //   messages.push(data.message)

    //   // console.log("MESSAGEs", messages)
    //   //db op


    //   //it shall re broadcast that message back to the client
    //   socket.to(data.session).emit("receive_message", messages)

    // })

  //when a user disconnects
  socket.on('disconnect', () => {
    console.log('user disconnected');

    users = users.filter(user=>user!==sockId)
    console.log("USERS:", users)

    players = users.length;
    console.log("CURRENT PLAYERS CONNECTED:", players)

  });

})

///////////////////////////////////////////
