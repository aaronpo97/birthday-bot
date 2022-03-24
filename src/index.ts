import { CacheType, Client, Intents, CommandInteraction } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const init = async (interaction: CommandInteraction<CacheType>) => {
   if (!interaction.guild) return;
   const { id, name } = interaction.guild;
   const guildInfo = { id, name };

   
   await interaction.reply(
      `Initialized birthday bot and registered the following guild: ${JSON.stringify({ id, name })}`
   );
};

client.once('ready', () => {
   console.log(`Logged in as ${client.user?.tag}`);

   console.log(`Now connected to:`);

   console.group();
   client.guilds.cache.forEach(async guild => {
      console.log(guild.name);
   });
   console.groupEnd();
});

client.on('interactionCreate', async interaction => {
   if (!interaction.isCommand()) return;

   const { commandName } = interaction;

   if (commandName === 'init') {
      await init(interaction);
   }
});

client.login(process.env.TOKEN);
