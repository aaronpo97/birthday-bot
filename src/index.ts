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
import triggerNotif from './functions/triggerNotif';
import help from './functions/help';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
   logger.info(`Logged in as ${client.user?.tag}`);

   cron.schedule('* */3 * * *', async () => {
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
         await initializeBot(interaction);
         break;
      case 'register':
         await registerUser(interaction);
         break;
      case 'birthdays':
         await viewBirthdays(interaction, client);
         break;
      case 'delete':
         deleteUser(interaction);
         break;
      case 'enable-notifs':
         await enableBirthdayNotifs(interaction);
         break;
      case 'disable-notifs':
         await disableBirthdayNotifs(interaction);
         break;
      case 'trigger-notif':
         await triggerNotif(interaction, client);
         break;
      case 'help':
         await help(interaction);
         break;
      default:
         break;
   }
});

client.login(process.env.TOKEN);
