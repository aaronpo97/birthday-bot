import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';

const deleteUser = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
   try {
      if (!interaction.member) return;
      const { id } = interaction.member.user;
      const user_id = BigInt(id);

      await knex.delete().from('users').where({ user_id });
      await interaction.reply('Deleted user.');
   } catch (error) {
      await interaction.reply('Something went wrong.');
   }
};

export default deleteUser;
