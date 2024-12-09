// https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await
import { promises as fs } from 'fs';
import path from 'path';

export default async function errorHandler(data: any) {
  try {

    const date = new Date();  // create a date
    const directoryName = date.toISOString().slice(0, 10).replace('-', ''); // remove '-' so file name remains valid
    const directoryPath = path.resolve(directoryName);  // this ensures that no matter where errorHandler is called, items are stored here

    await fs.mkdir(directoryPath, { recursive: true }); // recursive creates it if it doesn't exist

    const fileName = path.join(directoryPath, `Error_${directoryName}_${Math.floor(Math.random() * 100000000)}.txt`);

    await fs.writeFile(fileName, data.toString());

    console.log(`Error successfully written to new file ${fileName}.`);
  } catch (error) {
    console.error(`Error in error handler: `, error);
  }
}

