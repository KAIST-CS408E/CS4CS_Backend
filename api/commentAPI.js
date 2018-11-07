'use strict';

const Comment = require('../models/comment');
const config = require('../config/config.json');

exports.commit_comment = (alarm_id, author, contents) => 
    new Promise((resolve, reject) => {

    });

exports.commit_child_comment = (alarm_id, parent_id, author, contents) => 
    new Promise((resolve, reject) => {
        
    });