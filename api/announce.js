'use strict';

const Announcement = require('../models/announcement');
const Alarm = require('../models/alarm');

exports.commit_announce = (alarm_id, contents) =>
    new Promise((resolve, reject) => {
        Alarm.find({_id: alarm_id})
            .then(alarms => {
                const newAnnounce  = new Announcement({
                    alarm_id        : alarm_id,
                    created_at      : new Date(),
                    contents        : contents
                });
                newAnnounce.save();
                return resolve({status: 201, message: "Announcement Created"});
            })
        .catch(err => {
            return reject({status: 404, message: "Alarm Post Not Found!"});
        });
    });

exports.get_announces = (alarm_id) =>
    new Promise((resolve, reject) => {
        Announcement.find({
            alarm_id    : alarm_id
        })
        .sort('created_at')
        .then(announces => {
            resolve(announces);
        })
        .catch(err => {
            reject({status: 500, message: "Internal Server Error!"});
        })
    });

