'use strict';

const Alarm = require('../models/alarm');
const User = require('../models/user');

exports.get_alarms = () =>

    new Promise((resolve, reject) => {

        Alarm.find({}, {
            _id         : 0,
            title		: 1,
            desc		: 1,
            reporter_id : 1    
        }).sort('created_at')

        .then(alarms => {
            
            resolve(alarms);

        })

        .catch(err => {

            reject({ status: 500, message: "Internal Server Error !" });
            
        })

    });
    

exports.makeNewAlarm = (lat, lng, rad, title, cat_str, desc, reporter_email) => 

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
	                created_at: new Date()
                });
                return newAlarm.save()
                .then(() => {
                    console.log("Send report confirm message");
	                resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
                });
            }
        });
    });

