# NoFlo Assembly DB

[![Greenkeeper badge](https://badges.greenkeeper.io/noflo/noflo-assembly-db.svg)](https://greenkeeper.io/)

Reusable [Knex.js](http://knexjs.org/) database components for NoFlo Assembly Lines.

## Concept

[NoFlo Assembly Line](https://github.com/noflo/noflo-assembly) proposes hitting your application (i.e. business) goals first, reusability second. A concept similar to [Harvested Framework](https://martinfowler.com/bliki/HarvestedFramework.html).

Thus, many if not most components in NoFlo Assembly applications would prefer to call [Knex.js](http://knexjs.org/) directly as they like (with all the `join`'s and fine-tuning needed). But those patterns which appear to be very repetitive are exported to this library for reuse.
