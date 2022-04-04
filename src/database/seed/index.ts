import knex from '..';

const clearOldDb = async (): Promise<void> => {
   await knex.schema.dropTableIfExists('users');
   await knex.schema.dropTableIfExists('guilds');
};
const createTables = async (): Promise<void> => {
   await knex.schema
      .createTable('guilds', table => {
         table.bigInteger('guild_id').primary();
         table.string('guild_name');
         table.datetime('joined_at', { precision: 6 }).defaultTo(knex.fn.now(6));
      })
      .createTable('users', table => {
         table.increments().primary();
         table.bigInteger('user_id');
         table.string('username');
         table.integer('discriminator');
         table.bigInteger('guild').references('guild_id').inTable('guilds').onDelete('cascade');
         table.datetime('registered_at', { precision: 6 }).defaultTo(knex.fn.now(6));
         table.date('birthday');
      });
};

(async (): Promise<void> => {
   try {
      await clearOldDb();
      await createTables();

      process.exit(0);
   } catch (error) {
      console.log('Something went wrong 😞');
      console.dir(error);
   }
})();
