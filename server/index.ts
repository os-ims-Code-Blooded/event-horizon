import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from "dotenv";
import database from './db/index.ts';

//configure dotenv
dotenv.config();
//start express instance
const app = express();
const PORT: String = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;


// ROUTERS

//

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

export default { app };