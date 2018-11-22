// Requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = express.Router();
const port = process.env.port || 8001;
const route = require('./routes/index');
const mongoose = require('mongoose');
const Alarm = require('./models/alarm');
const sendAlarm = require('./api/sendAlarm');

// Mount middlewares
app.use(bodyParser.json());
app.use(logger('dev'));
route(router);
app.use('/', router);

// Make a connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log("Connected to mongodb server.")});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cs4cs', { useMongoClient: true });

// Start listening
app.listen(port);
console.log(`App runs on ${port}.`);

//Send all alarms for infinite time
function prevAlarm(){
    
    console.time('check');
    Alarm.find(function(err, alarms) {
        if (err) throw err;
        
        var count = 0;
        for (var i = 0; i < alarms.length; i++)
        {                           
            sendAlarm.send_alarm(alarms[i], false, i)
                .then(() => {                   
                                        
                    count += 1;
                    if(count == alarms.length)
                        console.timeEnd('check');
                       
                });                      
        }

    });
    
}

//setInterval(prevAlarm, 60000);

