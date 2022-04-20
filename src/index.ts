import { Client, Intents } from 'discord.js';
import cron from 'node-cron';

import 'dotenv/config';
import deleteUser from './commands/deleteUser';
import initializeBot from './commands/initializeBot';
import registerUser from './commands/registerUser';
import viewBirthdays from './commands/viewBirthdays';
import logger from './util/logger';

import birthdayReminder from './birthday-reminder';
import enableBirthdayNotifs from './commands/enableBirthdayNotifs';
import disableBirthdayNotifs from './commands/disableBirthdayNotifs';
import triggerNotif from './commands/triggerNotif';

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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  switch (interaction.commandName) {
    case 'init':
      await initializeBot.execute(interaction);
      break;
    case 'register':
      await registerUser.execute(interaction);
      break;
    case 'birthdays':
      await viewBirthdays.execute(interaction);
      break;
    case 'delete':
      deleteUser.execute(interaction);
      break;
    case 'enable-notifs':
      await enableBirthdayNotifs.execute(interaction);
      break;
    case 'disable-notifs':
      await disableBirthdayNotifs.execute(interaction);
      break;
    case 'trigger-notif':
      await triggerNotif.execute(interaction, client);
      break;
    default:
      break;
  }
});

client.login(process.env.TOKEN);
