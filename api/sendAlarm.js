var admin = require('firebase-admin');

var taeToken = 'ccnR-Yahzdk:APA91bGM578YgydGuTiybD2g0ybzFsLemUXuiUjyFsKfffc0V8T77MCXVsFSDphamfosuAlx4vucWHGmbosdAQBFvDZ1qzkxerUSvfZNd0dVuA2KMSSd57q4OsDwDBaKAergAszegn4X';
var youngToken1 = 'eaF84Mtd5WA:APA91bGUlzxBjAQQAydyJX8kFbbT_S3XipPq763RV02mGbxSbZ-fRULVoaj4mljMoj1FAvE6I5wDk6jed3wJGrJivjCsbypndD7yYRYi55iPqLfRmHRCOvZEL6446v20TOT4lpZgoXdU';
var shinToken = 'eTA1DM-NUCY:APA91bEjGXNNyCrlnVYiDTwngyh115LHCVSxaE2o9SfcVL0IgjIdIl2DRFGhRwV8npSusx-pbz_G9v3EjOhYRfe5bcNRElLqjhQfilKKPru_3CWRFyEx7E6gffH7KpbukpU9fVGgep1G';
var youngToken2 = 'c-j9hUE0-JU:APA91bH0N4xFjGNb4FIOYNOEIWCQkn-eAx9Cy921ST8TkeJ5C8iJR5MDbpVDRNctSrZIzVhu2g5kW1UJIAbVinfhc-9OXZiwNpFeQNVTX9xMQ8WfkOL3VB096qXl4F8V2hLjV9ZhBMZ-';

var serviceAccount = require('../cs4cs-d1f39-firebase-adminsdk-vnkqd-00261e2dfc.json');

var defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
});

var topic = 'alarm';
var dryRun = true;

exports.send_alarm = (alarm, is_it_first, index) => 
    new Promise((resolve, reject) => {

        var message = {

            data: {
                first: is_it_first.toString(),
                id: alarm._id.toString(),                              
                lat: alarm.lat.toString(),
                lng: alarm.lng.toString(),
                rad: alarm.rad.toString(),               
                title: alarm.title,
                cat_str: alarm.cat_str,
                desc: alarm.desc,             
                reporter_id: alarm.reporter_id.toString(),
                created_at: alarm.created_at.toString(),
                floor: alarm.floor,
                room_number: alarm.room_number             
            },
              topic: topic
//            token: taeToken
        };
         
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
                resolve();
             })
            .catch((error) => {
                console.log('Error sending message:', error);
                reject(error);
            });        
    });

