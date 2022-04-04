import knex from '../database';
import IUsers from '../database/types/IUsers';
import { CacheType, CommandInteraction } from 'discord.js';

const viewBirthdays = async (interaction: CommandInteraction<CacheType>) => {
   if (!interaction.guild) return;
   const { id: guildId } = interaction.guild;
   const guild_id = parseInt(guildId);
   const guildQuery = await knex.from('guilds').where({ guild_id }).select('*');
   if (!guildQuery.length) {
      await interaction.reply('Your guild is not registered.');
      return;
   }

   const currentGuildId = parseInt(interaction.guildId as string);
   const queriedDateString = interaction.options.getString('date');

   let dateQuery: Date;

   if (queriedDateString === 'today') {
      dateQuery = new Date(Date.now());
   } else {
      dateQuery = new Date(queriedDateString as string);
   }

   const timestampQuery = `${
      dateQuery.getMonth() + 1
   }/${dateQuery.getDate()}/${dateQuery.getFullYear()}`;

   console.log(timestampQuery);
   const birthdays: IUsers[] = await knex
      .select(`*`)
      .from(`users`)
      .whereRaw(`date_part('day', birthday) = date_part('day', TIMESTAMP '${timestampQuery}')`)
      .andWhereRaw(
         `date_part('month', birthday) = date_part('month', TIMESTAMP '${timestampQuery}')`
      )
      .andWhereRaw(`guild = ${currentGuildId}`);

   interaction.reply(JSON.stringify(birthdays));
};

export default viewBirthdays;
