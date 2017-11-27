const Component = require('noflo-assembly').default;
const { fail } = require('noflo-assembly');

class Update extends Component {
  constructor() {
    super({
      description: 'Updates a database record',
      validates: {
        db: 'func',
        'query.table': 'ok',
        'query.data': 'obj',
        'query.where': 'obj',
      },
    });
  }
  relay(msg, output) {
    const returning = msg.query.returning != null ? msg.query.returning : undefined;

    let sent = false;
    msg.db(msg.query.table)
      .update(msg.query.data, returning)
      .where(msg.query.where)
      .then((rows) => {
        msg.rowset = rows;
        msg.query = undefined;
        if (!sent) {
          sent = true;
          output.sendDone(msg);
        }
      })
      .catch((err) => {
        if (sent) {
          // The error is likely thrown elsewhere
          console.error(err);
        } else {
          sent = true;
          err.message += ' [in assembly-db/Update]';
          output.sendDone(fail(msg, err));
        }
      });
  }
}

exports.getComponent = function getComponent() {
  return new Update();
};
