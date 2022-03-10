const express = require('express');
const session = require('express-session');
const app = express();

//app.use(session({}));

app.use(session({secret: "enc-key",
	saveUninitialized: false,resave: false}));

app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + 
      	req.session.page_views + " times " +req.session.id);
   } else {
      req.session.page_views = 1;
      res.send("Welcome to session page !");
   }
});
app.listen(8000);