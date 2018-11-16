var admin = require('firebase-admin');
var registrationToken = 'eTA1DM-NUCY:APA91bEjGXNNyCrlnVYiDTwngyh115LHCVSxaE2o9SfcVL0IgjIdIl2DRFGhRwV8npSusx-pbz_G9v3EjOhYRfe5bcNRElLqjhQfilKKPru_3CWRFyEx7E6gffH7KpbukpU9fVGgep1G';
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
    token: registrationToken
};

admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });        
        
