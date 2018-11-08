'use strict'

const Alarm = require('../models/alarm');
const User = require('../models/user');

exports.requestNewAlarm = (receiver_email) => 

    new Promise((resolve, reject) =>
    {
        User.findOne({email: reveiver_email}, (err, user) => {
            if(err){
                console.log("database failure");
                reject({status: 500, message: err.toString()});
            }

            if(!user){

                console.log("User not found");
                reject({status: 404, message: 'User not found'});
            }

            Alarm.find({created_at: {$gt: user.last_alarm_check}, (err, alarm) => {
                
                user.last_alarm_check = new Date();
                
                user.save((err) => {
                    if(err){
                        console.log("Database Save error");
                        reject({status: 500, message: err.toString()});
                    }
                });

                resolve({status: 201, alarm_list: alarm});                             
            }); 
        });
    });
            
