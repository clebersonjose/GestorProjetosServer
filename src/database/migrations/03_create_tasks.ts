import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();

    table
      .integer('columnId')
      .notNullable()
      .references('id')
      .inTable('columns')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.string('name').notNullable();
    table.string('content');
    table.integer('position').notNullable();
    table.enu('priority', ['1', '2', '4', '3', '5']).notNullable();
    table.date('delivery').notNullable();
    table.enu('effort', ['1', '2', '4', '3', '5']).notNullable();
    table.enu('impact', ['1', '2', '4', '3', '5']).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tasks');
}
