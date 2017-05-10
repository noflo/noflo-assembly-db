import 'mocha';
import { expect } from 'chai';
import uuid from 'uuid';
import { asCallback } from 'noflo';
import db from './lib/db';

describe('Update component', () => {
  let wrapper;
  const productData = {
    id: uuid.v4(),
    user: uuid.v4(),
    name: 'Test Product',
  };
  let trans = null;
  let afterDone = null;

  before((done) => {
    wrapper = asCallback('assembly-db/Update');
    db.transaction((trx) => {
      trans = trx;
      trx('products')
      .insert(productData, 'id')
      .then((rows) => {
        productData.id = rows[0];
        done();
      })
      .catch(done);
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

  it('should update a database record', (done) => {
    const updateData = {
      name: 'Washy Disher',
    };
    wrapper({
      errors: [],
      db: trans,
      query: {
        table: 'products',
        data: updateData,
        where: { id: productData.id },
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
      trans('products')
      .count()
      .where('name', updateData.name)
      .then((rows) => {
        expect(rows[0].count).to.equal('1');
        done();
      })
      .catch(done);
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
