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
         table.bigInteger('discord_guild_id').unique().notNullable();
         table.string('guild_name').notNullable();
         table.datetime('joined_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable();
         table.bigInteger('birthday_channel_id');
         table.boolean('birthday_notifications_enabled').notNullable();
      })
      .createTable('users', table => {
         table.increments().primary();
         table.bigInteger('discord_user_id').notNullable();
         table.string('username').notNullable();
         table.integer('discriminator').notNullable();
         table.integer('guild');
         table.foreign('guild').references('guilds.id');
         table.datetime('registered_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable();
         table.date('birthday').notNullable();
      });
};

(async (): Promise<void> => {
   try {
      await clearOldDb();
      await createTables();
      logger.info('Seeded database.');
      process.exit(0);
   } catch (error) {
      if (error instanceof Error) logger.error(error.stack);
   }
})();
