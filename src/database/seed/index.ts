import knex from '..';
import logger from '../../util/logger';

const clearOldDb = async (): Promise<void> => {
   await knex.schema.dropTableIfExists('users');
   await knex.schema.dropTableIfExists('guilds');
};
const createTables = async (): Promise<void> => {
   await knex.schema
      .createTable('guilds', table => {
         table.increments('id').primary();
         table.bigInteger('discord_guild_id').unique();
         table.string('guild_name');
         table.datetime('joined_at', { precision: 6 }).defaultTo(knex.fn.now(6));
         table.bigInteger('birthday_channel_id');
         table.boolean('birthday_notifications_enabled');
      })
      .createTable('users', table => {
         table.increments().primary();
         table.bigInteger('discord_user_id');
         table.string('username');
         table.integer('discriminator');
         table.integer('guild');
         table.foreign('guild').references('guilds.id');
         table.datetime('registered_at', { precision: 6 }).defaultTo(knex.fn.now(6));
         table.date('birthday');
      });
};

(async (): Promise<void> => {
   try {
      await clearOldDb();
      await createTables();
      logger.info('Seeded database.');
      process.exit(0);
   } catch (error) {
      if (error instanceof Error) logger.error(error, error.message);
   }
})();
