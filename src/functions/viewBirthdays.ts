import knex from '../database';
import IUsers from '../database/types/IUsers';
import { CacheType, CommandInteraction } from 'discord.js';
import logger from '../util/logger';

import format from 'date-fns/format';
const viewBirthdays = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
   try {
      if (!interaction.guild) return;
      const { id: guildId } = interaction.guild;
      const discord_guild_id = BigInt(guildId);
      const guildQuery = await knex.from('guilds').where({ discord_guild_id }).select('*');
      if (!guildQuery.length) {
         await interaction.reply('Your guild is not registered.');
         return;
      }

      const queriedDateString = interaction.options.getString('date');

      let dateQuery: Date;

      if (queriedDateString === 'today') {
         dateQuery = new Date(Date.now());
      } else {
         dateQuery = new Date(queriedDateString as string);

         if (!dateQuery.getTime()) {
            throw new Error('Invalid date.');
         }
      }

      const timestampQuery = format(dateQuery, 'MM-dd-yyyy');

      const birthdays: Array<IUsers> = await knex
         .select(`*`)
         .from(`users`)
         .whereRaw(`date_part('day', birthday) = date_part('day', TIMESTAMP '${timestampQuery}')`)
         .andWhereRaw(
            `date_part('month', birthday) = date_part('month', TIMESTAMP '${timestampQuery}')`
         )
         .andWhere({ guild: guildQuery[0].id });

      interaction.reply(
         `Querying birthdays for the following date: ${format(dateQuery, 'MMMM do')} \n` +
            JSON.stringify(birthdays)
      );
   } catch (error) {
      if (error instanceof Error) {
         interaction.reply(error.message);
         logger.error('Something went wrong.');
      }
   }
};

export default viewBirthdays;
