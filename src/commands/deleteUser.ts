import { CacheType, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import knex from '../database';
import logger from '../util/logger';
import ICommands from './types/ICommands';

const deleteUser: ICommands = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes the user in the Birthday Database for the current active guild.'),
  async execute(interaction: CommandInteraction<CacheType>) {
    try {
      if (!interaction.member) return;
      const { id } = interaction.member.user;
      const discord_user_id = BigInt(id);
      await knex.delete().from('users').where({ discord_user_id });
      await interaction.reply('Deleted user.');
    } catch (error) {
      if (error instanceof Error) {
        interaction.reply(error.message);
        logger.error('Something went wrong.');
      }
    }
  },
};

export default deleteUser;
