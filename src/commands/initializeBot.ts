import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import IGuilds from '../database/types/IGuilds';
import logger from '../util/logger';
import ICommands from './types/ICommands';

const initializeBot: ICommands = {
  data: new SlashCommandBuilder()
    .setName('init')
    .setDescription('Initialize the Birthday Bot for your server.'),

  async execute(interaction: CommandInteraction<CacheType>) {
    try {
      if (!interaction.guild) return;
      const { id, name: guild_name } = interaction.guild;
      const discord_guild_id = BigInt(id);

      const guildQuery: ReadonlyArray<IGuilds> = await knex
        .from('guilds')
        .where({ discord_guild_id })
        .select('*');

      if (guildQuery.length) {
        await interaction.reply('Your guild is already registered.');
        return;
      }
      await knex<IGuilds>('guilds').insert({
        guild_name,
        discord_guild_id,
        birthday_channel_id: null,
        birthday_notifications_enabled: false,
      });
      await interaction.reply(`Initialized the Birthday Bot in '${guild_name}'.`);
    } catch (error) {
      if (error instanceof Error) {
        interaction.reply(error.message);
        logger.error('Something went wrong.');
      }
    }
  },
};

export default initializeBot;
