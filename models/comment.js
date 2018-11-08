'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Structure of the Alarm Post (2-level commenting)
 * 
 * [A alarm post]
 *    |-> [Comment 1]
 *    |     |-> [Child comment 1]
 *    |     |-> [Child comment 2]
 *    |-> [Comment 2]
 *    |-> [Comment 3]
 *          |-> [Child comment 1]
 */


const commentSchema = Schema({ 

    // relationship between a alarm post or a parent comment
    alarm_id        : ObjectId,
    parent_id       : ObjectId, // 대댓글 기능. 
    is_parent       : Boolean,  // parent or child
    
    // comment info
    posted_at       : Date,
    author          : {
                        id  : ObjectId,
                        name: String
                    },
    contents        : String
	
});
module.exports = mongoose.model('comment', commentSchema);
