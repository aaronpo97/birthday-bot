import differenceInYears from 'date-fns/differenceInYears';
import { TextChannel, Client, MessageEmbed } from 'discord.js';

import IGuilds from '../../database/types/IGuilds';
import IUsers from '../../database/types/IUsers';
import pg from '../../database';
import format from 'date-fns/format';

const getAndSendGuildBirthdays = async (client: Client, guild: IGuilds): Promise<void> => {
   const date: Date = new Date(Date.now());
   const { guild_name, id } = guild;

   const birthday_channel_id = guild.birthday_channel_id?.toString() as string;

   const timestampQuery = format(date, 'MM/dd/yyyy');

   const userBirthdays: ReadonlyArray<IUsers> = await pg
      .from(`users`)
      .whereRaw(`date_part('day', birthday) = date_part('day', TIMESTAMP '${timestampQuery}')`)
      .andWhereRaw(
         `date_part('month', birthday) = date_part('month', TIMESTAMP '${timestampQuery}')`
      )
      .andWhereRaw(`guild = ${id}`)
      .select('*');

   const channel = client.channels.cache.get(birthday_channel_id) as TextChannel;

   const birthdayEmbed = new MessageEmbed()
      .setColor('#ffffff')
      .setTitle(`Today's birthdays in ${guild_name}:`);

   userBirthdays.forEach(user => {
      const { username, discriminator, birthday } = user;
      birthdayEmbed.addField(
         `${username}#${discriminator}`,
         `Age: ${differenceInYears(new Date(), birthday)}`
      );
   });

   if (!userBirthdays.length) {
      birthdayEmbed.setDescription('No birthdays today.');
   }

   await channel.send({ embeds: [birthdayEmbed] });
};

export default getAndSendGuildBirthdays;
