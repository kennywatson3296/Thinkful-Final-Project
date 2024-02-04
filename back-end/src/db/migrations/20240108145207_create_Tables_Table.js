
exports.up = function(knex) {
  return knex.schema.createTable('tables', (t) => {
    t.increments('table_id').primary();
    t.string('table_name').notNullable();
    t.integer('capacity').notNullable();
    t.integer('reservation_id').unsigned();
    t.foreign('reservation_id')
    .references('reservation_id')
    .inTable('reservations')
    .onDelete('CASCADE');
    t.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTable('tables')
};
