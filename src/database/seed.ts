import knex from '.';
import IGuilds from './types/IGuilds';
import IUsers from './types/IUsers';

const clearOldDb = async (): Promise<void> => {
   await knex.schema.dropTableIfExists('guilds');
   await knex.schema.dropTableIfExists('users');
};
const createTables = async (): Promise<void> => {
   await knex.schema
      .createTable('guilds', table => {
         table.increments('id');
         table.string('guild_discord_id');
         table.string('guild_name');
         table.datetime('joined_at', { precision: 6 }).defaultTo(knex.fn.now(6));
      })
      .createTable('users', table => {
         table.increments('id');
         table.string('username');
         table.foreign('guild').references('guilds.id');
         table.date('birthday');
      });
};

(async (): Promise<void> => {
   try {
      await clearOldDb();
      await createTables();
      await knex<IGuilds>('guilds').insert({
         guild_name: 'sunt',
         guild_discord_id: 'PENIS',
      });

      await knex<IUsers>('users').insert({
         username: 'ayerble',
         guild: 1,
         birthday: new Date('November 9'),
      });

      const guilds = await knex<IGuilds>('guilds').select('*');
      const users = await knex<IGuilds>('users').select('*');

      process.exit(0);
   } catch (error) {
      console.error(error);
   }
})();
