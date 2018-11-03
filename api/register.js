'use strict';

const User = require('../models/user');
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

exports.registerUser = (name, email, phone_number) =>
    new Promise((resolve, reject) => {
        // kaistian certification steps:
        // 1. send an email with secret code
        // 2. verify the secret code
        const rand = randomstring.generate(8);
        const mailOptions = {
            to: email,
            subject: "[CS4CS] Please confirm your Email account",
            html: `Hello ${name}, <br>

            Your reset password token is <b>${rand}</b>. <br>
            If you are viewing this mail from a Android Device click this <a href="http://${config.server_ip}/${rand}">link</a>. <br>
            The token is valid for only 2 minutes.<br>

            Thanks,<br>
            CS4CS.`
        };
        
        smtpTransport.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
        var kaistian = false;

        const newUser = new User({
            name: name,
            email: email,
            phone_number: phone_number,
            created_at: new Date(),
            kaistian: kaistian
        });

        newUser.save()

        .then(() => resolve({ status: 201, message: 'User Registered Sucessfully !' }))
        
        .catch(err => {
			if (err.code == 11000) {

				reject({ status: 409, message: 'User Already Registered !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
        });
    });