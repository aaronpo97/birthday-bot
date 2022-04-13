import { CacheType, CommandInteraction, GuildChannel } from 'discord.js';
import knex from '../database';
import IGuilds from '../database/types/IGuilds';
import logger from '../util/logger';

const enableBirthdayNotifs = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
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
      if (birthday_channel_id && birthday_notifications_enabled) {
         interaction.reply('Birthday notifications are already enabled.');
         return;
      }

      const channel: GuildChannel = await interaction.guild.channels.create('birthday channel', {
         reason: 'Created the birthday channel for notifications.',
      });

      const channelId = BigInt(channel.id);
      const notificationsEnabled = true;
      await knex<IGuilds>('guilds').where({ discord_guild_id }).update({
         birthday_notifications_enabled: notificationsEnabled,
         birthday_channel_id: channelId,
      });

      interaction.reply('Your server now has birthday notifications enabled.');
   } catch (error) {
      if (error instanceof Error) {
         interaction.reply('Something went wrong!');
         logger.error(error.message);
      }
   }
};

export default enableBirthdayNotifs;
