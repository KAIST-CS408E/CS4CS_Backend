'use strict';

const Alarm = require('../models/alarm');

exports.makeNewAlarm = (lat, lng, rad, title, cat_str, desc) => 

    new Promise((resolve,reject) => 
    {
	// TODO: check validity, save to DB
        () => resolve({status: 201, message: 'Alarm is reported to server (title:'+title+')'});
    });
