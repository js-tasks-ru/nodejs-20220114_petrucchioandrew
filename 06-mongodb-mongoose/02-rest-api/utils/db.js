const ObjectId = require('mongoose').Types.ObjectId;

module.exports.isObjectIdValid = id =>
  ObjectId.isValid(id) && String(new ObjectId(id)) === id;
