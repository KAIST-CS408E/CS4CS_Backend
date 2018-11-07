'use strict';

const Alarm = require('../models/alarm');

exports.makeNewAlarm = (lat, lng, rad, title, cat_str, desc, reporter) => 

    new Promise((resolve,reject) => 
    {
        User.find({email: reporter})
        .then(users => {
            if(users.length == 0){
                reject({status: 401, message: 'User is not registered'});
            }
            else if(!users[0].kaistian){
                reject({status: 401, message: 'User is not Kaistian'});
            }
            else{
                 const newAlarm = new Alarm({
	                lat: lat,
                    lng: lng,
	                rad: rad,
	                title: title,
	                cat_str: cat_str,
	                desc: desc,
                    reporter: reporter,
	                created_at: new Date()
                });
                return newAlarm.save()
                .then(() => {
	                resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
                });
            }
        });
    };

