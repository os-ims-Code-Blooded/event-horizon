import { PrismaClient } from '@prisma/client';

/*
=====================================================================================
-------------------------------------------------------------------------------------
If receive error regarding privileges or password during attempts to run this file 
or connect to database:

  > sudo mysql
  > ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
  > exit;

The previous set of commands will set your account settings within mySQL so that
your password is set to an empty string. If you do not want to set your password
to an empty string, ensure that the password is reflected below.
-------------------------------------------------------------------------------------
=====================================================================================
*/


const database = new PrismaClient();

// this is exporting the client and its connection to be used in server and routers
export default database;
