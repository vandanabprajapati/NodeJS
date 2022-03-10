const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');

const app = express();
app.use(express.static('public'));  
app.use(function(req,res,next){
	console.log(req.method+"  " +req.url);
	next();
})
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'testdb'
});

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
	//store: new FileStore({ path: './session-data'})
}));
app.use(express.urlencoded({extended: false}));

app.post('/validate', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?'
			, [username, password], 
			function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send("Welcome "+
			request.session.username+
			"<br>"+request.session.id
			+"!!!"+
			"<br><a href='./logout'>Logout</a>" );
	} else {
		//response.send('Please login to view this page!');
		response.redirect('/login.html');
	}
});

app.get('/logout', (req, res) => {
  if (req.session.loggedin) {
    if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
		res.clearCookie("connect.sid")
        res.redirect('/login.html');
      }
	});
	
  }

  } else {
    res.redirect('/login.html')
  }
})
app.listen(8000);