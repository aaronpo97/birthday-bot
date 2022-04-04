import { Client, Intents } from 'discord.js';

import 'dotenv/config';
import deleteUser from './functions/deleteUser';
import initializeBot from './functions/init';
import registerUser from './functions/registerUser';
import viewBirthdays from './functions/viewBirthdays';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
   console.log(`Logged in as ${client.user?.tag}`);
   console.log(`Now connected to:`);
   console.group();
   client.guilds.cache.forEach(async guild => console.log(guild.name));
   console.groupEnd();
});

client.on('interactionCreate', async interaction => {
   if (!interaction.isCommand()) return;
   switch (interaction.commandName) {
      case 'init':
         initializeBot(interaction);
         break;
      case 'register':
         registerUser(interaction);
         break;
      case 'birthdays':
         viewBirthdays(interaction);
         break;

      case 'delete':
         deleteUser(interaction);
         break;
      default:
         break;
   }
});

client.login(process.env.TOKEN);
