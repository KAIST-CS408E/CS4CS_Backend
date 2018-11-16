'use strict';

const Alarm = require('../models/alarm');
const User = require('../models/user');
const admin = require('firebase-admin');
const serviceAccount = require('../cs4cs-d1f39-firebase-adminsdk-vnkqd-00261e2dfc.json');
const topic = 'alarm';

var defaultApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
});

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
            created_at  : 1
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
                
                newAlarm.save()
                .then(() => {
                    console.log("Send report confirm message");
	                resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
                })
                .then(() => {
                    
                    var message = {
                        data: {
                            title: 'alarm title',
                            body: 'alarm bdoy'
                        }
                    };

                    admin.messaging().send(message)
                        .then((response) => {
                            console.log('Successfully sent message, response');
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });                            
                });
                  
            }
        });
    });

