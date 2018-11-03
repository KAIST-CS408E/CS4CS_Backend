'use strict';

const User = require('../models/user');

exports.getProfile = email => 

    new Promise((resolve,reject) => 
    {
        
		User.find({ email: email }, { // 찾는 email이 없어도 에러 안뜨며, res에는 아무것도 담기지 않는다. (result가 없으므로)
            name: 1, 
            email: 1, 
            phone_number: 1, 
            created_at: 1, 
            _id: 0 
        })

		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

    });