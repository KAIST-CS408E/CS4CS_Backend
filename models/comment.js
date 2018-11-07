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


const userSchema = Schema({ 

    // relationship between a alarm post or a parent comment
    alarm_id        : ObjectId,
    parent_id       : ObjectId, // 대댓글 기능. 
    is_parent       : Boolean,  // parent or child
    
    // for human-readable url
    slug            : String,
    
    // combines the slugs and time information 
    // to make it easier to sort documents in a comment by date.
    full_slug       : String,
    
    // comment info
    posted_at       : String,
    author          : {
                        id  : ObjectId,
                        name: String
                    },
    contents        : String
	
});
module.exports = mongoose.model('comment', commentSchema);
