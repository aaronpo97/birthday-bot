import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const { PG_CONNECTION_STRING } = process.env;

const pg = knex({
  client: 'pg',
  connection: PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
});

export default pg;
