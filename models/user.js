'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({ 

	name 			: String,
	email			: String, // {type: String, required: true} 라고 설정 가능
	phone_number	: String,
    created_at		: String,
    kaistian        : Boolean
});

// Make a connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log("Connected to mongodb server.")});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cs4cs', { useMongoClient: true });

module.exports = mongoose.model('user', userSchema);