import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';

import IGuilds from '../database/types/IGuilds';
import IUsers from '../database/types/IUsers';
import logger from '../util/logger';
import ICommands from './types/ICommands';

const registerUser: ICommands = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register user!')
    .addStringOption((option) =>
      option
        .setName('birthday')
        .setDescription('Please enter your date of birth to be registered.')
        .setRequired(true),
    ) as SlashCommandBuilder,

  async execute(interaction: CommandInteraction<CacheType>) {
    try {
      if (!interaction.guild) return;
      if (!interaction.member) return;

      const birthdayString = interaction.options.getString('birthday');

      if (!Date.parse(birthdayString as string)) {
        await interaction.reply('Invalid date.');
        return;
      }

      const birthday = new Date(birthdayString as string);

      const { id: guildId } = interaction.guild;
      const { id, username, discriminator } = interaction.member.user;

      const discord_user_id = BigInt(id);
      const discord_guild_id = BigInt(guildId);

      const guildQuery: ReadonlyArray<IGuilds> = await knex
        .from('guilds')
        .where({ discord_guild_id })
        .select('*');

      if (!guildQuery.length) {
        await interaction.reply('Your guild is not registered.');
        return;
      }

      const userQuery: ReadonlyArray<IUsers> = await knex
        .from('users')
        .where({ discord_user_id })
        .andWhere({ guild: guildQuery[0].id })
        .select('*');

      if (userQuery.length) {
        await interaction.reply('You are already registered.');
        return;
      }

      await knex<IUsers>('users').insert({
        discord_user_id,
        birthday,
        username,
        discriminator: parseInt(discriminator, 10),
        guild: guildQuery[0].id,
      });

      await interaction.reply('Registered user.');
    } catch (error) {
      if (error instanceof Error) {
        interaction.reply('Something went wrong.');
        logger.error(error.message);
      }
    }
  },
};

export default registerUser;
