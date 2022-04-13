import { Client, Intents } from 'discord.js';
import cron from 'node-cron';

import 'dotenv/config';
import deleteUser from './functions/deleteUser';
import initializeBot from './functions/init';
import registerUser from './functions/registerUser';
import viewBirthdays from './functions/viewBirthdays';
import logger from './util/logger';

import birthdayReminder from './birthday-reminder';
import enableBirthdayNotifs from './functions/enableBirthdayNotifs';
import disableBirthdayNotifs from './functions/disableBirthdayNotifs';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
   logger.info(`Logged in as ${client.user?.tag}`);

   cron.schedule('0 0,3,6,9,12,15,18,21 * * *', async () => {
      try {
         await birthdayReminder(client);
      } catch (error) {
         logger.error(error instanceof Error ? error.message : 'Something went wrong.');
      }
   });
});

client.on('interactionCreate', async interaction => {
   if (!interaction.isCommand()) return;
   switch (interaction.commandName) {
      case 'init':
         initializeBot(interaction);
         break;
      case 'register':
         registerUser(interaction);
         break;
      case 'birthdays':
         viewBirthdays(interaction);
         break;
      case 'delete':
         deleteUser(interaction);
         break;
      case 'enable-notifs':
         enableBirthdayNotifs(interaction);
         break;
      case 'disable-notifs':
         disableBirthdayNotifs(interaction);
         break;
      default:
         break;
   }
});

client.login(process.env.TOKEN);
