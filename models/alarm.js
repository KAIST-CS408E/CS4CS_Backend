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
    reporter_id : ObjectId,
    created_at         :     Date,
    floor        :    String,
    room_number     : String
});

module.exports = mongoose.model('alarm', alarmSchema);
