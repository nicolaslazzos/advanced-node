// because the test suite does not execute the server, we need to execute a few things before running
// the tests, in order to, for example, be able to interact with the database and use mongoose models
jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });