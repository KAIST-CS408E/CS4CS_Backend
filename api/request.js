'use strict'

const Alarm = require('../models/alarm');
const User = require('../models/user');

exports.requestNewAlarm = (receiver_email) => 

    new Promise((resolve, reject) =>
    {
        console.log(receiver_email);
        User.findOne({email: receiver_email}, function(err, user){
            
            console.log("in find one call back");
            if(err){
                console.log("database failure");
                reject({status: 500, message: err.toString()});
            }

            if(!user){

                console.log("User not found");
                reject({status: 404, message: 'User not found'});
            }
            else
            {
                Alarm.find({created_at: {$gte: user.last_alarm_check}}, function(err, alarm){
                    
                    console.log("in find call back");
                    user.last_alarm_check = new Date();
                
                     user.save((err) => {
                        if(err){
                            console.log("Database Save error");
                            reject({status: 500, message: err.toString()});
                        }else
                            resolve({status:201, alarm_list: alarm});                                              
                     });
    
                });
            }
        });
    });
            
