import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import IGuilds from '../database/types/IGuilds';
import logger from '../util/logger';

const enableDisableNotifs = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
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

      const channelString = interaction.options.getString('channel');

      const birthday_channel_id = BigInt(channelString?.replace(/\D/g, '') as string);
      const birthday_notifications_enabled = true;
      await knex<IGuilds>('guilds')
         .where({ discord_guild_id })
         .update({ birthday_notifications_enabled, birthday_channel_id });

      interaction.reply('Your server now has birthday notifications enabled.');
   } catch (error) {
      if (error instanceof Error) {
         interaction.reply(error.message);
         logger.error('Something went wrong.');
      }
   }
};

export default enableDisableNotifs;
