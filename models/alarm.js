'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alarmSchema = Schema({ 

	lat 			: Number,
	lng			: Number,
	rad			: Number,
	title			: String,
	cat_str			: String,
	desc		        : String
	
});

// Make a connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log("Alarm.js: Connected to mongodb server.")});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cs4cs', { useMongoClient: true });

module.exports = mongoose.model('alarm', alarmSchema);
