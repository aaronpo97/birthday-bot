import { Client, CommandInteraction, CacheType } from 'discord.js';
import getAndSendGuildBirthdays from '../birthday-reminder/utils/getAndSendGuildBirthdays';
import IGuilds from '../database/types/IGuilds';
import pg from '../database';

const triggerNotif = async (
   interaction: CommandInteraction<CacheType>,
   client: Client
): Promise<void> => {
   if (!interaction.guildId) return;
   const guildQuery: ReadonlyArray<IGuilds> = await pg
      .select('*')
      .from('guilds')
      .where({ discord_guild_id: interaction.guildId })
      .where({ birthday_notifications_enabled: true })
      .andWhereRaw('birthday_channel_id IS NOT null');
   if (!guildQuery.length) {
      interaction.reply(
         'Your guild does not have birthday notifications enabled or is not registered.'
      );
      return;
   }
   await getAndSendGuildBirthdays(client, guildQuery[0]);
   await interaction.reply(
      `Sent a birthday notification to <#${guildQuery[0].birthday_channel_id}>`
   );
};
export default triggerNotif;
