import IUsers from '../database/types/IUsers';
import { TextChannel, Client, MessageEmbed, Message } from 'discord.js';
import pg from '../database';

import differenceInYears from 'date-fns/differenceInYears';

const birthdayReminder = async (client: Client): Promise<void> => {
   const dateQuery: Date = new Date(Date.now());
   const currentGuildId = 1;
   const guildName = 'the lab';
   const timestampQuery = `${
      dateQuery.getMonth() + 1
   }/${dateQuery.getDate()}/${dateQuery.getFullYear()}`;

   const birthdays: IUsers[] = await pg
      .select(`*`)
      .from(`users`)
      .whereRaw(`date_part('day', birthday) = date_part('day', TIMESTAMP '${timestampQuery}')`)
      .andWhereRaw(
         `date_part('month', birthday) = date_part('month', TIMESTAMP '${timestampQuery}')`
      )
      .andWhereRaw(`guild = ${currentGuildId}`);

   const channel = client.channels.cache.get('893541963868012584') as TextChannel;

   const birthdayEmbed = new MessageEmbed()
      .setColor('#ffffff')
      .setTitle(`Today's birthdays in ${guildName}:`);

   birthdays.forEach(user => {
      const { username, discriminator, birthday } = user;
      birthdayEmbed.addField(
         `${username}#${discriminator}`,
         `Age: ${differenceInYears(new Date(), birthday)}`
      );
   });

   channel.send({ embeds: [birthdayEmbed] });
};

export default birthdayReminder;
