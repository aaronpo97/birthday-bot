import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import dotenv from 'dotenv';

dotenv.config();

const { APPLICATION_ID, GUILD_ID, TOKEN } = process.env;

const commands = [
   new SlashCommandBuilder().setName('init').setDescription('Initialize birthday bot!'),
   new SlashCommandBuilder()
      .setName('register')
      .setDescription('Register user!')
      .addStringOption(option =>
         option.setName('birthday').setDescription('Your birthday!').setRequired(true)
      ),
   new SlashCommandBuilder()
      .setName('birthdays')
      .setDescription('Query birthdays for a specific date.')
      .addStringOption(option =>
         option
            .setName('date')
            .setDescription('The date you would like to query for birthdays.')
            .setRequired(true)
      ),
   new SlashCommandBuilder().setName('delete').setDescription('Delete your birthday.'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN as string);

rest
   .put(Routes.applicationGuildCommands(APPLICATION_ID as string, GUILD_ID as string), {
      body: commands,
   })
   .then(() => console.log('Successfully registered application commands.'))
   .catch(console.error);
