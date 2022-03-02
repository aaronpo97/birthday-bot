import { BaseCommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js';

export interface CommandInterface extends ChatInputApplicationCommandData {
   run: (client: Client, interaction: BaseCommandInteraction) => void;
}
