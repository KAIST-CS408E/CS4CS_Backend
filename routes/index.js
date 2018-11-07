'use strict';

const register = require('../api/register');
const profile = require('../api/profile');
const report = require('../api/report');

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

    // Report
    router.post('/alarm', function(req, res){
        
        const lat = req.body.lat;
        const lng = req.body.lng;
        const rad = req.body.rad;
	
        const title = req.body.title;
        const cat_str = req.body.cat_str;
        const desc = req.body.desc;

        //console.log(typeof lat);
        console.log(title+ ": ("+lat + "," + lng + "," + rad+")\n");

    	// save alarm
    	report.makeNewAlarm(lat, lng, rad, title, cat_str, desc)

        .then(result => { // once query is resolved
                res.status(result.status).json({ message: result.message }); 
        })
        .catch(err => { // once query is rejected        
                res.status(err.status).json({ message: err.message });
        });

        //res.json({message: "success"});
    });

}
