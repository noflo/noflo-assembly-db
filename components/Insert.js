import Component, { fail } from 'noflo-assembly';

export class Insert extends Component {
  constructor() {
    super({
      description: 'Inserts a database record',
      validates: {
        'db': 'func',
        'query.table': 'ok',
        'query.data': 'obj',
      },
    });
  }
  relay(msg, output) {
    let returning = msg.query.returning != null ? msg.query.returning : undefined;

    return msg.db(msg.query.table)
    .insert(msg.query.data, returning)
    .then(function(rows) {
      msg.rowset = rows;
      msg.query = undefined;
      output.sendDone(msg);
    }).catch(function(err) {
      err.message += ' [in DbInsert]';
      output.sendDone(fail(msg, err));
    });
  }
}

export function getComponent() {
  return new Insert();
}
