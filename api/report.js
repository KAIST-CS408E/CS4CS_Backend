'use strict';

const Alarm = require('../models/alarm');

exports.makeNewAlarm = (lat, lng, rad, title, cat_str, desc) => 

    new Promise((resolve,reject) => 
    {
        const newAlarm = new Alarm({
	        lat: lat,
            lng: lng,
	        rad: rad,
	        title: title,
	        cat_str: cat_str,
	        desc: desc,
	        created_at: new Date()
        });
        return newAlarm.save()
        .then(() => {
	        resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
        });
    });
