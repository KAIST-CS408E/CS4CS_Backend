'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const announcementSchema = Schema({
    alarm_id        : ObjectId,
    created_at      : Date,
    contents        : String
});
module.exports = mongoose.model('announcement', announcementSchema);
