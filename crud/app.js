var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var session=require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('views','./views');
app.use(session({
	secret:"abc",
	resave:false,
	saveUninitialized:true
}));

var users=[];

mongoose.connect("mongodb://localhost:27017/bookdb",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

var db=mongoose.connection;
db.on('error',console.error.bind('console','connection error'));
db.once('open',function(){
	console.log('Connection established');

	var bookSchema=mongoose.Schema({
		name:String,
		author:String,
		price:Number,
		category:String 
	},{collection:'books'});

	var Book=mongoose.model('book',bookSchema);

	app.get('/signup',function(req,res){
		res.render('signup',{"message":''});
	});

	app.post('/signup',function(req,res){
		if(!req.body.username || !req.body.password)
		{
			res.render('signup',{"message":"enter both username and password"});
		}
		else
		{
			users.filter(function(user){
				if(user.username == req.body.username)
				{
					res.render('signup',{"message":"user already exists"});
				}
			});
			var newUser={
				username:req.body.username,
				password:req.body.password
			}
			users.push(newUser);
			req.session.user=newUser;
			res.redirect('/showBook');
		}
	});

	app.get('/login',function(req,res){
		res.render('login',{"message":''});
	});

	app.post('/login',function(req,res){
		if(!req.body.username || !req.body.password)
		{
			res.render('login',{"message":"enter both username and password"});
		}
		else
		{
			if(users.length==0)
			{
				res.redirect('/signup');
			}
			else
			{
				users.filter(function(user){
					if(user.username == req.body.username && user.password==req.body.password)
					{
						req.session.user=user;
						res.redirect('/showBook');
					}
					else
					{
						res.render('login',{"message":"user not registered"});
					}
				});
				
			}
		}
	});	
	app.get('/logout',function(req,res){
		req.session.destroy();
		res.redirect('/login');
	})

	app.post('/searchBook',function(req,res){
		var name=req.body.txtsearch;
		if(req.session.user)
		{
			Book.find({name:name},function(error,result){
				if(error)
					throw error;
				res.render('showBook',{"bookList":result,"username":req.session.user.username});
			});
		}
		else
		{
			res.redirect('/login');
		}
	});
	app.get('/showBook',function(req,res){
		if(req.session.user)
		{
			Book.find(function(error,result){
				if(error)
					throw error;
				res.render('showBook',{"bookList":result,"username":req.session.user.username});
			});	
		}
		else{
			res.redirect('/login');
		}

	});

	app.get('/addBook',function(req,res){
		if(req.session.user)
		{
			res.render('addBook',{'bookList':''});
		}
		else
		{
			res.redirect('/login');	
		}
	});

	app.get('/editBook/:id',function(req,res){
		if(req.session.user)
		{
			Book.findById(req.params.id,function(error,result){
				if(error)
					throw error;
				res.render('addBook',{'bookList':result});
			});
		}
		else{
			res.redirect('/login');
		}
	});
	app.post('/submitData',function(req,res){
		var id=req.body.txtid;
		var name=req.body.name;
		var author=req.body.author;
		var price=req.body.price;
		var category=req.body.category;

		if(id.length>0)
		{
			var newBook={
				name:name,
				author:author,
				price:price,
				category:category
			};
			Book.findByIdAndUpdate(id,newBook,function(error,result){
				if(error)
					throw error;
				console.log(newBook.name + " updated");
			});
		}
		else
		{
			var s1=new Book({
				name:name,
				author:author,
				price:price,
				category:category
			});
			s1.save(function(error,result){
				if(error)
					throw error;
				console.log(s1.name + " inserted");
			});
		}
		res.redirect('/showBook');
	});

	app.get('/deleteBook/:id',function(req,res){
		if(req.session.user)
		{
			Book.findByIdAndRemove(req.params.id,function(error,result){
				if(error)
					throw error;
				console.log('Book Deleted');
			});
			res.redirect('/showBook');
		}
		else
		{
			res.redirect('/login');
		}
	});
});	

app.listen(3333);