var admin = require('firebase-admin');

var taeToken = 'fFdYhqQ1CxE:APA91bEAdS-Pe_py6ZSDumLfeQQ1GahX3tuYc_u-ysMf3glQwaCFOLUjeFTc3BZrRU2Tlxij4e2tAOc2ZTRIFMVZgJV3y4KH_8JIp__oHXONuAlytZYaIGhjKhovUUKrrgQ62iDSPiJx';
var youngToken1 = 'eaF84Mtd5WA:APA91bGUlzxBjAQQAydyJX8kFbbT_S3XipPq763RV02mGbxSbZ-fRULVoaj4mljMoj1FAvE6I5wDk6jed3wJGrJivjCsbypndD7yYRYi55iPqLfRmHRCOvZEL6446v20TOT4lpZgoXdU';
var shinToken = 'eTA1DM-NUCY:APA91bEjGXNNyCrlnVYiDTwngyh115LHCVSxaE2o9SfcVL0IgjIdIl2DRFGhRwV8npSusx-pbz_G9v3EjOhYRfe5bcNRElLqjhQfilKKPru_3CWRFyEx7E6gffH7KpbukpU9fVGgep1G';
var youngToken2 = 'c-j9hUE0-JU:APA91bH0N4xFjGNb4FIOYNOEIWCQkn-eAx9Cy921ST8TkeJ5C8iJR5MDbpVDRNctSrZIzVhu2g5kW1UJIAbVinfhc-9OXZiwNpFeQNVTX9xMQ8WfkOL3VB096qXl4F8V2hLjV9ZhBMZ-';

var serviceAccount = require('../cs4cs-d1f39-firebase-adminsdk-vnkqd-00261e2dfc.json');

var defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
});

var topic = 'alarm';
var dryRun = true;

exports.send_alarm = (alarm) => 
    new Promise((resolve, reject) => {

        var message = {

            data: {
                title: alarm.title,
                body: alarm.desc
            },
//            topic: topic
            token: taeToken
        };

        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
                console.log(alarm.title);
                resolve();
             })
            .catch((error) => {
                console.log('Error sending message:', error);
                reject(error);
            });        
    });

