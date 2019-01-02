const Component = require('noflo-assembly').default;
const { fail } = require('noflo-assembly');

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

    let sent = false;
    msg.db(msg.query.table)
      .insert(msg.query.data, returning)
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
          err.message += ' [in assembly-db/Insert]';
          output.sendDone(fail(msg, err));
        }
      });
  }
}

exports.getComponent = function getComponent() {
  return new Insert();
};
