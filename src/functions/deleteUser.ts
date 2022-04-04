import knex from '../database';
import IUsers from '../database/types/IUsers';
import { CacheType, CommandInteraction } from 'discord.js';

const deleteUser = async (interaction: CommandInteraction<CacheType>) => {
   try {
      if (!interaction.member) return;
      const { id } = interaction.member.user;
      const user_id = parseInt(id);

      await knex.delete().from('users').where({ user_id });
      await interaction.reply('Deleted user.');
   } catch (error) {
      await interaction.reply('Something went wrong.');
   }
};

export default deleteUser;
