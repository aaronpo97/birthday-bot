import { CacheType, CommandInteraction } from 'discord.js';
import knex from '../database';
import IGuilds from '../database/types/IGuilds';

const initializeBot = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
   try {
      if (!interaction.guild) return;
      const { id, name: guild_name } = interaction.guild;

      const guild_id = parseInt(id);
      const guildQuery = await knex.from('guilds').where({ guild_id }).select('*');
      if (guildQuery.length) {
         await interaction.reply('Your guild is already registered.');
         return;
      }
      await knex<IGuilds>('guilds').insert({ guild_name, guild_id });
      await interaction.reply(`Initialized the Birthday Bot in '${guild_name}'.`);
   } catch (error) {
      await interaction.reply(`Something went wrong. 🙁 \n ${error}`);
   }
};

export default initializeBot;
