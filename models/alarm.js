'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const alarmSchema = Schema({ 
	lat 			: Number,
	lng			: Number,
	rad			: Number,
	title			: String,
	cat_str			: String,
	desc		        : String,
    reporter_id : ObjectId    
});

module.exports = mongoose.model('alarm', alarmSchema);
