import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import process from 'process';
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';

dotenv.config();
const { TOKEN } = process.env;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

ready(client);
interactionCreate(client);
client.login(TOKEN);
