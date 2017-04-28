const Component = require('noflo-assembly').default;
const fail = require('noflo-assembly').fail;

class Insert extends Component {
  constructor() {
    super({
      description: 'Inserts a database record',
      validates: {
        db: 'func',
        'query.table': 'ok',
        'query.data': 'obj',
      },
    });
  }
  relay(msg, output) {
    const returning = msg.query.returning != null ? msg.query.returning : undefined;

    msg.db(msg.query.table)
    .insert(msg.query.data, returning)
    .then((rows) => {
      msg.rowset = rows;
      msg.query = undefined;
      output.sendDone(msg);
    }).catch((err) => {
      err.message += ' [in assembly-db/Insert]';
      output.sendDone(fail(msg, err));
    });
  }
}

exports.getComponent = function getComponent() {
  return new Insert();
};
