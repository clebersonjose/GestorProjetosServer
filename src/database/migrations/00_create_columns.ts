import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('columns', (table) => {
    table.increments('columnCode').primary();
    table.string('name').notNullable();
    table.float('position').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('columns');
}
