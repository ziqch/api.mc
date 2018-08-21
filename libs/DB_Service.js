const mysql = require('mysql');
let config;
try {
  config = require('../database.json')
} catch (e) {
  config = require('../database.json.example')
}

function createConnection(config) {
  let connection = mysql.createConnection({
    host: config.local.host,
    user: config.local.user,
    password: config.local.password,
    database: config.local.database,
    multipleStatements: config.local.multipleStatements
  });
  let DBService = {
    INSERT: function (tableName, data) {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO ?? SET ?', [tableName, data], function (err, res, field) {
          if (err) reject(err);
          else resolve(res);
        });
      })
    },
    SAVE: function (tableName, findFieldName, findValue, changeData) {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE ?? SET ? WHERE ?? = ?',[tableName, changeData, findFieldName, findValue],
          function (err, res, field) {
            if (err) reject(err);
            else resolve(res);
          });
      });
    },
    GET: function (tableName, findFieldName, findValue, options) {
      return new Promise((resolve, reject) => {
        let sql;
        if (options && options === 'first'){
          sql = 'SELECT * FROM ?? WHERE ?? = ? ORDER BY `create_time` DESC LIMIT 1';
        } else {
          sql = 'SELECT * FROM ?? WHERE ?? = ?';
        }
        connection.query(sql, [tableName, findFieldName, findValue],
          (err, res, field) => {
            if (err) reject(err);
            else resolve(res);
          });
      });
    },
    CONN: connection
  };
  return DBService;
}

let DB = createConnection(config)
module.exports = DB;

