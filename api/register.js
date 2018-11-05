'use strict';

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const config = require('../config/config.json');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: `${config.email}`,
        pass: `${config.password}`
    }
});

exports.registerUserInit = (name, email, phone_number) =>
    new Promise((resolve, reject) => {
        /*
        Write a confirmation email
        */
        const secret_code = randomstring.generate(8);
        const salt = bcrypt.genSaltSync(10);
        const token = bcrypt.hashSync(secret_code, salt) // hashed secret_code

        const mailOptions = {
            to: email,
            subject: "[CS4CS] Please confirm your Email account",
            html: `Hello ${name}, <br>

            Your reset password token is <b>${secret_code}</b>. <br>
            If you are viewing this mail from a Android Device click this <a href="http://${config.server_ip}/${secret_code}">link</a>. <br>
            The token is valid for only 2 minutes.<br>

            Thanks,<br>
            CS4CS.`
        };

        User.find({email: email})

        .then(users => {

            if (users.length == 0) {

                return smtpTransport.sendMail(mailOptions)

                .then(info => {
                    /*
                    Store token and created date for verification
                    */
                    const newUser = new User({
                        name: name,
                        email: email,
                        phone_number: phone_number,
                        created_at: new Date(),
                        token: token,
                        kaistian: false
                    });
        
                    return newUser.save();
                })
        
                .then(() => {
        
                    resolve({ status: 201, message: 'Please check a confirmation email for instructions' });
        
                })

                .catch(err => {
                    if (err.code == 11000) {
        
                        reject({ status: 409, message: 'User Already Registered !' });
        
                    } else if (err.code == "EENVELOPE") {
        
                        reject({ status: 409, message: 'Invalid Email !' });
        
                    } else {
        
                        reject({ status: 500, message: 'Internal Server Error !' });
                        
                    }
                });

            } else {

                reject({ status: 409, message: 'User Already Registered !' });

            }
        })

        .catch(err => {

            reject({ status: 500, message: 'Internal Server Error !' });

        });
        
    });


exports.registerUserVerify = (name, email, phone_number, token) =>
    new Promise((resolve, reject) => {
        
        User.find({ email: email })

        .then(users => {

            let user = users[0];

            const time_diff = new Date() - new Date(user.created_at);
            const seconds = Math.floor(time_diff / 1000);
            console.log(`Seconds: ${seconds}`);

            if ( seconds < 120 ) {
                
                return user;

            } else {

                user.remove({email: email});

                return reject({ status: 401, message: 'Time Out ! Try Again' }); 

            }

        })

        .then(user => {

            if (bcrypt.compareSync(token, user.token)) {

                if ( email.substring(email.lastIndexOf("@") +1) == "kaist.ac.kr" ) {
                    user.kaistian = true;
                } else {
                    user.kaistian = false;
                }

                user.token = undefined;

                return user.save();

            } else {

                user.remove({email: email});

                return reject({ status: 401, message: 'Invalid Token ! Try Again' });

            }    
        })

        .then(user => resolve({ status: 200, message: 'Email Verified Successfully' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
    });
