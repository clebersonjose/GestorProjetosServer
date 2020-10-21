import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('columns', (table) => {
    table.increments('id').unique().primary();
    table.string('name').notNullable();
    table.integer('position').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('columns');
}
