import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from "dotenv";

import database from './db/index.ts';

import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { it } from 'node:test';
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
app.use(express.static(path.resolve(__dirname, '../client/dist/')));

app.listen(PORT, () => {
    database.$connect()
        .then((connectionEstablished) => {
            console.log(`Prisma has connected to the database...`);
            console.log("Server listening on Port",CLIENT_URL + ':' + PORT);
        })
        .catch((error) => {
            console.error(`Failure on database connection...`)
        })
});

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


  let messages : any = [];
  
  //when the server establishes a connection, it shall do the following:


io.on('connection', (socket)=>{

  console.log(`user connected: ${socket.id}`)
  // console.log("\n \n**********SOCKET:************ \n \n", socket)
  let sockId = socket.id

  //listening for a join room event
  socket.on('join_session', data=>{
    console.log("SESSION DATA", data)

    console.log(sockId)

    //connects the socket object to the incoming room data
    socket.join(data)
    socket.to(data.session).emit(messages)
  })


  //if it receives data marked send_message
  socket.on('send_message', (data)=>{
    console.log("MESSAGE DATA", data)
    console.log("SOCK ID", sockId)
    messages.push(data.message)
    console.log("MESSAGEs", messages)
    //db op


    //it shall re broadcast that message back to the client
    socket.to(data.session).emit("receive_message", messages)

  })
   socket.on('disconnect', () => {
    console.log('user disconnected');
  });

})

//The http server listens at this port
server.listen(8080, ()=>{
  console.log("SERVER RUNNING MARATHON")
  console.log("Server listening on Port",CLIENT_URL + ':' + PORT);
})


///////////////////////////////////////////



// app.listen(PORT, () => {
//     console.log("Server listening on Port",CLIENT_URL + ':' + PORT);
// });
// app.on('error', (err: any) => console.error('Error', err));


// export default { app };