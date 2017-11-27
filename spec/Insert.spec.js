const { expect } = require('chai');
const uuid = require('uuid');
const { asCallback } = require('noflo');
const db = require('./lib/db');

describe('Insert component', () => {
  let wrapper;
  const productData = {
    id: uuid.v4(),
    user: uuid.v4(),
    name: 'Test Product',
  };
  let trans = null;
  let afterDone = null;

  before((done) => {
    wrapper = asCallback('assembly-db/Insert');
    db.transaction((trx) => {
      trans = trx;
      done();
      return null;
    }).catch((e) => {
      if (e.message !== 'TestCleanUp') {
        console.log('Knex error:', e);
      }
      afterDone();
    });
  });

  after((done) => {
    afterDone = done;
    trans.rollback(new Error('TestCleanUp'));
  });

  it('should insert a database record', (done) => {
    wrapper({
      errors: [],
      db: trans,
      query: {
        table: 'products',
        data: productData,
        returning: 'id',
      },
    }, (err, msg) => {
      if (err) { done(err); return; }
      if (msg.errors.length > 0) {
        console.log(msg.errors);
      }
      expect(msg.errors).to.have.lengthOf(0);
      expect(msg.rowset).to.be.ok;
      expect(msg.rowset[0]).to.equal(productData.id);
      done();
    });
  });

  it('should fail if input is missing', (done) => {
    wrapper({
      errors: [],
      db: trans,
      query: {
        table: 'products',
      },
    }, (err, msg) => {
      expect(msg.errors.length).to.be.above(0);
      done();
    });
  });
});
