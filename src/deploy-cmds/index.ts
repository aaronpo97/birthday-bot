/* eslint-disable import/no-extraneous-dependencies */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import dotenv from 'dotenv';
import deleteUser from '../commands/deleteUser';
import disableBirthdayNotifs from '../commands/disableBirthdayNotifs';
import enableBirthdayNotifs from '../commands/enableBirthdayNotifs';
import initializeBot from '../commands/initializeBot';
import registerUser from '../commands/registerUser';
import triggerNotif from '../commands/triggerNotif';
import viewBirthdays from '../commands/viewBirthdays';
import logger from '../util/logger';

dotenv.config();

const { APPLICATION_ID, GUILD_ID, TOKEN } = process.env;

const commands = [
  deleteUser.data,
  disableBirthdayNotifs.data,
  enableBirthdayNotifs.data,
  initializeBot.data,
  registerUser.data,
  triggerNotif.data,
  viewBirthdays.data,
].map((command) => command.toJSON());

logger.info(commands);

const rest = new REST({ version: '9' }).setToken(TOKEN as string);

rest
  .put(Routes.applicationGuildCommands(APPLICATION_ID as string, GUILD_ID as string), {
    body: commands,
  })
  .then(() => logger.info('Successfully registered application commands.'))
  .catch((error) => {
    if (error instanceof Error) {
      logger.error(error.stack);
    }
  });
