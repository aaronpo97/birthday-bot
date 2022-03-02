import { BaseCommandInteraction, Client } from 'discord.js';
import { CommandInterface } from '../CommandInterface';

export const Hello: CommandInterface = {
   name: 'hello',
   description: 'Returns a greeting',
   type: 'CHAT_INPUT',
   run: async (client: Client, interaction: BaseCommandInteraction) => {
      const content = 'Hello there!';

      await interaction.followUp({
         ephemeral: true,
         content,
      });
   },
};
