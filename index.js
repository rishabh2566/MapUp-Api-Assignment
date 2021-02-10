const express = require("express");
const app = express();
const api = require('./api.js');
const HeaderAuth = require('./auth.js');
// const cors = require('cors');

// Body parser to read json in body of req
var bodyParser = require('body-parser');
// Increasing limit as Payload may be bigger than defalut 100kb
app.use(bodyParser.json({limit: '20mb'}));
 
// app.use(cors());

// create a server object:
app.post("/api", (req, res, next) => {
  // check for valid type in req.body
  if(!req.body.type || req.body.type != "LineString") {
    res.status(400).send('Not a valid LineString');
    return;
  }
  next();
});

// using basic HTTP auth to secure the api
app.use(HeaderAuth);

app.use('/api', api);

//the server object listens on port 3000
var port = 3000;
app.listen(port, function(){
  console.log('Server listening on port ' + port + '. Send POST request on http://localhost:3000/api');
});
