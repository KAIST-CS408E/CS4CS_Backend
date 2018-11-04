'use strict';

const register = require('../api/register');
const profile = require('../api/profile');

/*
req and res are both JSON format.
*/

module.exports = function(router) {
    // Default
    router.get('/', (req, res) => {

        res.end('Welcome to cs4cs!');

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

    // Receive Alarm
    router.post('/alarm', function(req, res){
        
        const lat = req.body.lat;
        const lng = req.body.lng;
        const rad = req.body.rad;

        console.log(typeof lat);
        console.log(lat + " " + lng + " " + rad);
        res.json({message: "success"});

    });

}