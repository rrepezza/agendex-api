const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/agendex-db', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;