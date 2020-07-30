const mongoose = require('mongoose');
const util = require('util');
const redis = require('redis');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);

// promisify takes a function that takes a callback as the last argument and returns a function that returns a promise
client.hget = util.promisify(client.hget);

// we make a copy of the original mongoose exec function
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  // if we use this function we enable cache use for each specific query
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  // we return this so its possible to chain other functions after cache
  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // key to identify specific query data in the redis cache
  const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }));

  const cachedValue = await client.hget(this.hashKey, key);

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);

    // we convert the stored json object to a mongoose model
    Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const res = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(res));

  // returns a mongoose model
  return res;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}