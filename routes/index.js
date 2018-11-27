'use strict';

const register = require('../api/register');
const profile = require('../api/profile');
const report = require('../api/report');
const commentAPI = require('../api/commentAPI');
const announce = require('../api/announce');

/*
req and res are both JSON format.
*/

module.exports = function(router) {
    // Default
    router.get('/', (req, res) => {

        res.status(200).json({ message: 'Welcome to cs4cs!' });
        
    });

    // Register
    router.post('/users', (req, res) => {
        
        const name = req.body.name;
        const email = req.body.email;
        const phone_number = req.body.phone_number;
        const token = req.body.token;
        console.log(name + email + phone_number);

        if (!name || !email || !phone_number || !name.trim() || !email.trim() || !phone_number.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

        } else if (!token || !token.trim()) { // user is not verified via email

            // Send a confirmation email
            register.registerUserInit(name, email, phone_number)
            
            .then(result => { // once query is resolved

                res.setHeader('Location', '/users/' + email); // user profile url
                res.status(result.status).json({ message: result.message });
            
            })

            .catch(err => { // once query is rejected
                
                res.status(err.status).json({ message: err.message });

            });

        } else { // secret code(token) was generated, so we need to verify the user
            
            register.registerUserVerify(name, email, phone_number, token)

            .then(result => {

                res.setHeader('Location', '/users/' + email); // user profile url
                res.status(result.status).json({ message: result.message });

            })

            .catch(err => {

                res.status(err.status).json({ message: err.message });

            });

        }

    });

    // Profile
    router.get('/users/:email', (req, res) => {

        profile.getProfile(req.params.email) // 찾는 email이 없어도 에러 안뜨며, res에는 아무것도 담기지 않는다.
        
        .then(result => res.json(result))

        .catch(err => res.status(err.status).json( { message: err.message }));
        
    });


/**
 * ALARM
 */

    // Report (post a alarm)
    router.post('/alarm/report', function(req, res){
        
        const lat = req.body.lat;
        const lng = req.body.lng;
        const rad = req.body.rad;
	
        const title = req.body.title;
        const cat_str = req.body.cat_str;
        const desc = req.body.desc;
        const reporter_email = req.body.reporter;        
        const floor = req.body.floor;
        const room_number = req.body.room_number; 

        console.log(title+ ": ("+lat + "," + lng + "," + rad+")\n");
        console.log(floor + " " + room_number);

    	// save alarm
    	report.makeNewAlarm(lat, lng, rad, title, cat_str, desc, reporter_email, floor, room_number)

        .then(result => { // once query is resolved
                res.status(result.status).json({ message: result.message }); 
        })
        .catch(err => { // once query is rejected        
                res.status(err.status).json({ message: err.message });
        });

    });
    
    // Show a list of alarm posts
    router.get('/alarm/get_list', (req, res) => {

        /**
         * REQUEST
         * 
         * only need url ("/alarmlist")
         */

        /**
         * RESPONSE
         * 
         * list of info of each alarm post 
         * 
         * (depend on what response model Eunhyeok will make)
         * BUT your response model has to contain alarm_id for further request
         * (see below requests' urls)
         */

        report.get_alarms()

        .then(result => res.json(result))

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });

    });

    router.get('/alarm/reporter/:alarm_id', (req, res) => {
        const alarm_id = req.params.alarm_id;
        report.getReporter(alarm_id)
        .then(result => res.json(result))
        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
    });

/**
 * COMMENT
 */

    // Get a comment list of the alarm post
    router.get('/comment/get_list/:alarm_id', (req, res) => {

        /**
         * REQUEST
         * 
         * alarm_id on url
         */

        /**
         * RESPONSE
         * 
         * list of info of each comment post 
         * 
         * (depend on what response model Eunhyeok will make)
         * BUT your response model has to contain 
         * alarm_id and parent_id(parent comment's object id) for further request
         */

        const alarm_id = req.params.alarm_id;

        commentAPI.get_comments(alarm_id)

        .then(result => res.json(result))

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
    });

    // Leave a comment (not a child comment)
    router.post('/comment/make/:alarm_id', (req, res) => {
        
        /**
         * REQUEST
         * 
         * alarm_id on url
         * author email
         * contents string
         */

        /**
         * RESPONSE
         * 
         * use (or modify) Model/Response
         */

        const alarm_id = req.params.alarm_id;
        const author = req.body.author;
        const contents = req.body.contents;

        commentAPI.commit_comment(alarm_id, author, contents)

        .then(result => {
            res.status(result.status).json({ message: result.message, id: result.id });
        })

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
        
    });

    // Get a list of comment children of the parent comment
    router.get('/comment/get_list_reply/:alarm_id/:parent_id', (req, res) => {

        /**
         * REQUEST
         * 
         * alarm_id, parent_id on url
         */

        /**
         * RESPONSE
         * 
         * list of info of each child comments 
         * (depend on what response model Eunhyeok will make)
         * 
         * BUT your response model has to contain 
         * alarm_id and parent_id(parent comment's object id) for further request
         */

        const alarm_id = req.params.alarm_id;
        const parent_id = req.params.parent_id;

        commentAPI.get_child_comments(alarm_id, parent_id)

        .then(result => res.json(result))

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });

    });

    // Leave a child comment
    router.post('/comment/make_reply/:alarm_id/:parent_id', (req, res) => {
        
        /**
         * REQUEST
         * 
         * alarm_id, parent_id on url
         * author email
         * contents string
         */

        /**
         * RESPONSE
         * 
         * use (or modify) Model/Response
         */

        const alarm_id = req.params.alarm_id;
        const parent_id = req.params.parent_id;
        const author = req.body.author;
        const contents = req.body.contents;

        commentAPI.commit_child_comment(alarm_id, parent_id, author, contents)

        .then(result => {
            res.status(result.status).json({ message: result.message });
        })

        .catch(err => {
            console.log(err.message);
            res.status(err.status).json({ message: err.message });
        });
    });
    




    /*
     *  Announcements 
     *  */

    
    router.post('/announce/make/:alarm_id', (req, res) => {
 
        const alarm_id = req.params.alarm_id;
        const contents = req.body.contents;

        announce.commit_announce(alarm_id, contents)

        .then(result => {
            res.status(result.status).json({ message: result.message, id: result.id });
        })

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });

    });

    router.get('/announce/get_list/:alarm_id', (req, res) => {

        const alarm_id = req.params.alarm_id;

        announce.get_announces(alarm_id)

        .then(result => res.json(result))

        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
 
    });

}






