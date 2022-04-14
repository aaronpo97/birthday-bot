import knex from '../database';
import IUsers from '../database/types/IUsers';
import { CacheType, Client, CommandInteraction, MessageEmbed } from 'discord.js';
import logger from '../util/logger';

import format from 'date-fns/format';
import IGuilds from '../database/types/IGuilds';
const viewBirthdays = async (
   interaction: CommandInteraction<CacheType>,
   client: Client
): Promise<void> => {
   try {
      if (!interaction.guild) return;

      const { id: guildId } = interaction.guild;
      const discord_guild_id = BigInt(guildId);
      const guildQuery: ReadonlyArray<IGuilds> = await knex
         .from('guilds')
         .where({ discord_guild_id })
         .select('*');

      if (!guildQuery.length) {
         await interaction.reply('Your guild is not registered.');
         return;
      }

      const queriedDateString = interaction.options.getString('date') as string;
      const dateQuery = new Date(
         queriedDateString.toLowerCase() === 'today' ? Date.now() : queriedDateString
      );

      if (!dateQuery.getTime()) {
         throw new Error('Invalid date.');
      }

      const timestampQuery = format(dateQuery, 'MM-dd-yyyy');

      const birthdays: ReadonlyArray<IUsers> = await knex
         .select(`*`)
         .from(`users`)
         .whereRaw(`date_part('day', birthday) = date_part('day', TIMESTAMP '${timestampQuery}')`)
         .andWhereRaw(
            `date_part('month', birthday) = date_part('month', TIMESTAMP '${timestampQuery}')`
         )
         .andWhere({ guild: guildQuery[0].id });

      const birthdayEmbed = new MessageEmbed()
         .setColor('#ffffff')
         .setTitle(`Birthdays on ${format(dateQuery, 'MMMM do')}:`);

      if (!birthdays.length) {
         birthdayEmbed.setDescription('No birthdays that day. 🙁');
      }
      birthdays.forEach(user => {
         birthdayEmbed.addField(`${user.username}#${user.discriminator}`, '');
      });

      await interaction.reply({ embeds: [birthdayEmbed] });
   } catch (error) {
      if (error instanceof Error) {
         logger.error(error.message);
      }
   }
};

export default viewBirthdays;
