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
module.exports = mongoose.model('user', userSchema);
