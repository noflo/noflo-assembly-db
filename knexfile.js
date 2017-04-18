module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://user:@localhost/nofloassemblydb',
};
