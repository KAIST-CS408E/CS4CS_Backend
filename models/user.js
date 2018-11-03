'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({ 

	name 			: String,
	email			: String,
	phone_number	: String,
	created_at		: String,
	token			: {type: String, required: false}, // secret code for email verification
	kaistian        : Boolean
	
});

// Make a connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log("Connected to mongodb server.")});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cs4cs', { useMongoClient: true });

module.exports = mongoose.model('user', userSchema);