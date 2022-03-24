import dotenv from 'dotenv';
dotenv.config();

import knex from 'knex';

const { DATABASE: database, HOST: host, PASSWORD: password, PORT: port, USER: user } = process.env;

const pg = knex({
   client: 'pg',
   connection: { database, host, password, user, port: parseInt(port as string) },
});

export default pg;
