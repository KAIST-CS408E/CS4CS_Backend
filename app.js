// Requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = express.Router();
const port = process.env.port || 8003;
const route = require('./routes/index');

// Mount middlewares
app.use(bodyParser.json());
app.use(logger('dev'));
route(router);
app.use('/', router);

// Start listening
app.listen(port);
console.log(`App runs on ${port}.`);