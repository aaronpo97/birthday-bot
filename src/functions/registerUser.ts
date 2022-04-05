import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import IUsers from '../database/types/IUsers';

const registerUser = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
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

      const user_id = parseInt(id);
      const guild_id = parseInt(guildId);

      const guildQuery = await knex.from('guilds').where({ guild_id }).select('*');
      if (!guildQuery.length) {
         await interaction.reply('Your guild is not registered.');
         return;
      }

      const userQuery = await knex.from('users').where({ user_id }).select('*');
      if (userQuery.length) {
         await interaction.reply('You are already registered.');
         return;
      }

      await knex<IUsers>('users').insert({
         user_id,
         guild: guild_id,
         birthday,
         discriminator: parseInt(discriminator),
         username,
      });

      await interaction.reply('Registered user.');
   } catch (error) {
      await interaction.reply(`Something went wrong. 🙁 \n ${error}`);
   }
};

export default registerUser;
