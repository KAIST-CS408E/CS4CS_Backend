'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alarmSchema = Schema({ 
	lat 			: Number,
	lng			: Number,
	rad			: Number,
	title			: String,
	cat_str			: String,
	desc		        : String,
    reporter        : String	
});

module.exports = mongoose.model('alarm', alarmSchema);
