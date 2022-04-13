import { Client } from 'discord.js';

import IGuilds from '../database/types/IGuilds';
import pg from '../database';
import logger from '../util/logger';
import getAndSendGuildBirthdays from './utils/getAndSendGuildBirthdays';

const birthdayReminder = async (client: Client): Promise<void> => {
   const guildQuery: ReadonlyArray<IGuilds> = await pg
      .select('*')
      .from('guilds')
      .where({ birthday_notifications_enabled: true })
      .andWhereRaw('birthday_channel_id IS NOT null');

   if (!guildQuery.length) {
      return;
   }

   const guildPromises: Array<Promise<void>> = [];

   guildQuery.forEach(guild => guildPromises.push(getAndSendGuildBirthdays(client, guild)));

   await Promise.all(guildPromises);
   logger.info('Sent birthday reminder messages.');
};

export default birthdayReminder;
