// Create simple table for tests
exports.up = (knex) => {
  return knex.schema.createTableIfNotExists('products', (t) => {
    t.uuid('id').primary();
    t.uuid('user').notNullable().index();
    t.string('name').notNullable();
    t.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('products');
};
