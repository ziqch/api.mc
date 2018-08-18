'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('race',{
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    name: {type: 'string', notNull: true},
    introduction: {type: 'string', notNull: true},
    start_time: {type: 'datetime', notNull: true},
    end_time: {type: 'datetime', notNull: true}
  }).then(function (res) {
  }, function (err) {
    throw err
  });
};

exports.down = function(db) {
  return db.dropTable('race').then(function (res) {
  }, function (err) {
    throw err
  });
};

exports._meta = {
  "version": 1
};
