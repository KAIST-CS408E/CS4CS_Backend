'use strict';

const Alarm = require('../models/alarm');
const User = require('../models/user');
// const ObjectID = require('mongoose').Schema.Types.ObjectId;
const sendAlarm = require('./sendAlarm');

exports.get_alarms = () =>

    new Promise((resolve, reject) => {

        Alarm.find({}, {
            _id         : 1,
            lat         : 1,
            lng         : 1,
            rad         : 1,
            title		: 1,
            cat_str     : 1,
            desc		: 1,
            reporter_id : 1,    
            created_at  : 1,
            floor       : 1,
            room_number : 1
        }).sort('created_at')

        .then(alarms => {
            
            resolve(alarms);

        })

        .catch(err => {

            reject({ status: 500, message: "Internal Server Error !" });
            
        })

    });
    

exports.makeNewAlarm = (lat, lng, rad, title, cat_str, 
        desc, reporter_email, floor, room_number) => 

    new Promise((resolve, reject) => 
    {
        
        User.find({email: reporter_email})
        .then(users => {
            if(users.length == 0){
                console.log("Unregistered reporter: "+reporter_email);
                reject({status: 401, message: 'User is not registered'});
            }
            else if(!users[0].kaistian){
                console.log("Not kaistian reporter: "+reporter_email);
                reject({status: 401, message: 'User is not Kaistian'});
            }
            else{
                console.log("Kaistian reporter: "+reporter_email);
                const newAlarm = new Alarm({
	                lat: lat,
                    lng: lng,
	                rad: rad,
	                title: title,
	                cat_str: cat_str,
	                desc: desc,
                    reporter_id: users[0]._id,
	                created_at: new Date(),
                    floor: floor,
                    room_number: room_number 
                });
                
                newAlarm.save()
                .then(() => {
                    console.log("Send report confirm message");
	                resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
                })
                .then(() => {
                    sendAlarm.send_alarm(newAlarm, true, 0);    
                });
                  
            }
        });
    });


exports.getReporter = (alarm_id) =>

    new Promise((resolve, reject) =>
    {
        console.log("Will find "+alarm_id);

        Alarm.find({_id: alarm_id})
        .then(alarms => {
            console.log("Done finding");
            if(alarms.length == 0){
                console.log("Invalid alarm ID");
                reject({status: 401, message: 'Invalid alarm ID'});
            }
            else{
                console.log("Found alarm");
                return alarms[0].reporter_id;
            }
        })
        .then(reporter_id => {
            console.log("reporter id:")
            console.log(reporter_id)
            return User.find({_id: reporter_id})
        })
        .then(users => {
            if(users.length == 0){
                console.log("Invalid reporter ID");
                reject({status: 401, message: 'Invalid reporter ID'});
            }
            else{
                resolve(users[0]);
            }
        })
        .catch(err => {

            reject({ status: 500, message: "Internal Server Error !" });
            
        })
    });

