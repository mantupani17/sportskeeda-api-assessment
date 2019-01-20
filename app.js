var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser')
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');

// constant variables
var constants = require('./config/environment-config');

// custom router mounting
const sportskeeda = require('./routes/Frontend');

// set view engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


// body-parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));       
app.use(cookieparser());
app.use(session({secret:'abc123jakjakaa098',resave:false,saveUninitialized:true}))


// set static path
app.use(express.static(path.join(__dirname, 'public')));


// mounting router
app.use('/',sportskeeda);

require('./cron-jobs/job');

app.listen(constants.PORT);
console.log('running on '+constants.PORT);