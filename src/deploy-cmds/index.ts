/* eslint-disable import/no-extraneous-dependencies */
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import dotenv from 'dotenv';
import logger from '../util/logger';

dotenv.config();

const { APPLICATION_ID, GUILD_ID, TOKEN } = process.env;

const commands = [
  new SlashCommandBuilder().setName('init').setDescription('Initialize birthday bot!'),
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register user!')
    .addStringOption((option) =>
      option
        .setName('birthday')
        .setDescription('Please enter your date of birth to be registered.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('birthdays')
    .setDescription('Query birthdays for a specific date.')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('The date you would like to query for birthdays.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('enable-notifs')
    .setDescription('Enable birthday notifications.'),
  new SlashCommandBuilder()
    .setName('disable-notifs')
    .setDescription('Disable birthday notifications.'),
  new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete your birthday from the database.'),
  new SlashCommandBuilder()
    .setName('trigger-notif')
    .setDescription('Trigger a birthday notification to the birthday channel.'),
].map((command) => command.toJSON());

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
