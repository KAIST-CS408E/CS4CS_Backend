var admin = require('firebase-admin');
var registrationToken = 'fFdYhqQ1CxE:APA91bEAdS-Pe_py6ZSDumLfeQQ1GahX3tuYc_u-ysMf3glQwaCFOLUjeFTc3BZrRU2Tlxij4e2tAOc2ZTRIFMVZgJV3y4KH_8JIp__oHXONuAlytZYaIGhjKhovUUKrrgQ62iDSPiJx';
var inyoungsToken = 'eaF84Mtd5WA:APA91bGUlzxBjAQQAydyJX8kFbbT_S3XipPq763RV02mGbxSbZ-fRULVoaj4mljMoj1FAvE6I5wDk6jed3wJGrJivjCsbypndD7yYRYi55iPqLfRmHRCOvZEL6446v20TOT4lpZgoXdU';
var serviceAccount = require('./cs4cs-d1f39-firebase-adminsdk-vnkqd-00261e2dfc.json');

var defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
});

var topic = 'alarm';
var dryRun = true;

var message = {

    data: {
        title: 'zebal',
        body: 'please'
    },
    topic: topic
//    token: registrationToken
};

admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });        

console.log("test executing");
