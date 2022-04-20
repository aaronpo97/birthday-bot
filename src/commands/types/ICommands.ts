/* eslint-disable no-unused-vars */
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, Client } from 'discord.js';

export default interface ICommands {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction<CacheType>, client?: Client): Promise<void>;
}
