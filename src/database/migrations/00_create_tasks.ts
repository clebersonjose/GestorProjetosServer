import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("taskCode").primary();
    table.string("name").notNullable();
    table.string("content");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("tasks");
}
