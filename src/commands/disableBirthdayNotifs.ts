import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import IGuilds from '../database/types/IGuilds';
import logger from '../util/logger';
import ICommands from './types/ICommands';

const disableBirthdayNotifs: ICommands = {
  data: new SlashCommandBuilder()
    .setName('disable-birthday-notifs')
    .setDescription('Turns off the periodic birthday notifications that send every 3 hours.'),
  async execute(interaction: CommandInteraction<CacheType>) {
    try {
      if (!interaction.guild) return;
      const { id } = interaction.guild;
      const discord_guild_id = BigInt(id);

      const guildQuery: ReadonlyArray<IGuilds> = await knex
        .from('guilds')
        .where({ discord_guild_id })
        .select('*');

      if (!guildQuery.length) {
        interaction.reply('Your guild is not registered.');
        return;
      }

      const { birthday_notifications_enabled, birthday_channel_id } = guildQuery[0];
      if (!(birthday_channel_id && birthday_notifications_enabled)) {
        interaction.reply('Birthday notifications are already disabled.');
        return;
      }

      await knex<IGuilds>('guilds')
        .where({ discord_guild_id })
        .update({ birthday_notifications_enabled: false, birthday_channel_id: null });

      await interaction.guild.channels.cache.get(birthday_channel_id.toString())?.delete();
      await interaction.reply('Your server now has birthday notifications disabled.');
    } catch (error) {
      if (error instanceof Error) {
        interaction.reply('Something went wrong!');
        logger.error(error.message);
      }
    }
  },
};

export default disableBirthdayNotifs;
