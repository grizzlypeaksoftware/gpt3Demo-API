var express = require("express");
require("dotenv").config();
var cors = require('cors');
const bodyParser = require('body-parser');

// route handlers
var smartText = require("./routes/financial_smart_text");
var gpt = require("./routes/gpt");
var stormy = require("./routes/stormy");

//session
var session = require('express-session');

var app = express();
app.use(bodyParser.json());

app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: true
  }));

app.use(cors({credentials: true, origin: true}));

app.use("/fst", smartText);
app.use("/gpt", gpt);
app.use("/stormy", stormy);


// redirect the user to the  authorization page
app.get("/authorize", (req, res) => {
    res.send({status: false, message: "Not yet implemented", data:{}});
	//var callbackURL = 'http://localhost:3111/callback';

	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	//res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', callbackURL));
});

// handle the callback from the  authorization flow
app.get("/callback", (req, res) => {
    res.send({status: false, message: "Not yet implemented", data:{}});
    // exchange the authorization code we just received for an access token
    /*
	client.getAccessToken(req.query.code, 'http://localhost:3111/callback').then(result => {
        // use the access token to fetch the user's profile information
        var path = "/profile.json";
        
		req.session.access_token = result.access_token;
		req.session.refresh_token = result.refresh_token;

		res.redirect("http://localhost:3000/")
	}).catch(err => {
		res.status(err.status).send(err);
    });xrw
    */
});

app.listen(process.env.JADE_API_PORT, function(){
    console.log("listening on port" + process.env.JADE_API_PORT);
});
