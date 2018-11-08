'use strict';

const Comment = require('../models/comment');
const Alarm = require('../models/alarm');
const User = require('../models/user');
const config = require('../config/config.json');

exports.commit_comment = (alarm_id, author, contents) => 
    new Promise((resolve, reject) => {

        Alarm.find({ _id: alarm_id })
        .then(alarms => {

            User.find({ email: author })
            .then(users => {
                
                const newComment = new Comment({
                    alarm_id        : alarm_id,
                    is_parent       : true,
                    created_at      : new Date(),
                    author          : {
                                        id  : users[0]._id,
                                        name : users[0].name                
                                    },
                    contents        : contents
                });

                newComment.save();

                return resolve({ status: 201, message: "Comment Created", id: newComment._id });

            })
            .catch(err => {

                return reject({ status: 401, message: "Unauthorized Error ! Please register first" });
            
            })

        })
        .catch(err => {

            return reject({ status: 404, message: "Alarm Post Not Found ! Please reload" });
        
        });

    });

exports.commit_child_comment = (alarm_id, parent_id, author, contents) => 
    new Promise((resolve, reject) => {
        
        Alarm.find({ _id: alarm_id })
        .then(alarms => {

            Comment.find({ _id: parent_id })
            .then(parent_comments => {
                
                User.find({ email: author })
                .then(users => {
                    
                    const newComment = new Comment({
                        alarm_id        : alarm_id,
                        parent_id       : parent_id,
                        is_parent       : false,
                        created_at      : new Date(),
                        author          : {
                                            id  : users[0]._id,
                                            name : users[0].name                
                                        },
                        contents        : contents
                    });

                    return newComment.save(); // return a Promise

                })
                .then(() => {
                    // if newComment.save(); succeed
                    return resolve({ status: 201, message: "Comment Created" });
                })
                .catch(err => {

                    return reject({ status: 401, message: "Unauthorized Error ! Please register first" });
                
                })

            })
            .catch(err => {
                
                return reject({ status: 404, messasge: "Comment Not Found ! Please reload" });

            })

        })
        .catch(err => {

            return reject({ status: 404, message: "Alarm Post Not Found ! Please reload" });
        
        });

    });

exports.get_comments = (alarm_id) => 
    new Promise((resolve, reject) => {

        Comment.find({
            alarm_id    : alarm_id, 
            is_parent   : true
        }, 
        
        {   // projection. you can select values you want to get
            // https://stackoverflow.com/questions/24949544/mongodb-cant-canonicalize-query-badvalue-projection-cannot-have-a-mix-of-incl
            _id             : 0,
            created_at      : 1,
            author          : 1,
            contents        : 1
        })
        
        .sort('created_at')

        .then(comments => {
            
            resolve(comments);

        })

        .catch(err => {

            reject({ status: 500, message: "Internal Server Error !" });
            
        })

    });

exports.get_child_comments = (alarm_id, parent_id) => 
    new Promise((resolve, reject) => {

        Comment.find({
            alarm_id    : alarm_id, 
            parent_id   : parent_id, 
            is_parent   : false
        }, 
        
        {   // projection. you can select values you want to get
            _id             : 0,
            created_at      : 1,
            author          : 1,
            contents        : 1
        })
        
        .sort('created_at')

        .then(comments => {
            
            resolve(comments);

        })

        .catch(err => {

            reject({ status: 500, message: "Internal Server Error !" });
            
        })

    });