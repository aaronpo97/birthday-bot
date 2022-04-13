import dotenv from 'dotenv';
dotenv.config();

import knex from 'knex';

const { PG_CONNECTION_STRING } = process.env;

const pg = knex({
   client: 'pg',
   connection: PG_CONNECTION_STRING,
   searchPath: ['knex', 'public'],
});

export default pg;
