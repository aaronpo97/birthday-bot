import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import logger from '../util/logger';

const deleteUser = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
   try {
      if (!interaction.member) return;
      const { id } = interaction.member.user;
      const discord_user_id = BigInt(id);

      await knex.delete().from('users').where({ discord_user_id });
      await interaction.reply('Deleted user.');
   } catch (error) {
      if (error instanceof Error) {
         interaction.reply(error.message);
         logger.error('Something went wrong.');
      }
   }
};

export default deleteUser;
