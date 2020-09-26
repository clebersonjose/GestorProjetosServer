import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('taskCode').primary();
    table.string('name').notNullable();
    table.string('content');

    table
      .integer('column')
      .notNullable()
      .references('columnCode')
      .inTable('columns')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.float('position').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tasks');
}
