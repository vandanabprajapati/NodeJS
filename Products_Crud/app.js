var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var session=require('express-session');
var multer=require('multer');

var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./uploads');
	},
	filename:function(req,file,cb){
		cb(null,file.originalname);
	}
});

var upload=multer({storage:storage});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('./uploads'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('views','./views');
app.use(session({

	secret:"abc",
	resave:false,
	saveUninitialized:true

}));
mongoose.connect("mongodb://localhost:27017/dbproduct",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

var db=mongoose.connection;
db.on('error',console.error.bind('console','Connection Failed'));
db.once('open',function(){
	console.log('Connection Established');

	var productSchema=mongoose.Schema({
		name:String,
		price:Number,
		sale:String,
		category:String,
		pimg:String
	},{collection:'producttbs'});

	var userSchema=mongoose.Schema({
		username:String,
		password:String
	},{collection:'userstb'});

	var Product=mongoose.model('product',productSchema);
	var User=mongoose.model('user',userSchema);

	app.get('/signup',function(req,res){
		req.session.destroy();
		res.render('signup',{"message":''});
	});

	app.post('/signup',function(req,res){
		if(!req.body.username || !req.body.password)
		{
			res.render('signup',{"message":"enter both username and password"});
		}
		else
		{
			var username=req.body.username;
			var password=req.body.password;

			User.find({username:username},function(error,result){
				if(result.length>0)
				{
					res.render('signup',{"message":"username already exists"});
				}
				else
				{
					var newUser=new User({
						username:username,
						password:password
					});

					newUser.save(function(error,result){
						if(error)
							throw error;
						console.log("user registered");
					});
					req.session.user=newUser.username;
					res.redirect('/showProduct');
				}
			});
		}
	});

	app.get('/login',function(req,res){
		req.session.destroy();
		res.render('login',{"message":''});
	});

	app.post('/login',function(req,res){
		if(!req.body.username || !req.body.password)
		{
			res.render('login',{"message":"enter both username and password"});
		}
		else
		{
			var username=req.body.username;
			var password=req.body.password;

			User.find({username:username,password:password},function(error,result){
				if(result.length==0)
				{
					res.redirect('/signup');
				}
				else 
				{
					
						req.session.user=username;
						res.redirect('/showProduct');
					// }	
					// else
					// {
					// 	res.render('login',{"message":"incorrect username or password"});
					// }
				}
			});
		}
	});

	app.get('/logout',function(req,res){
		req.session.destroy();
		res.redirect('/login');
	});

	app.post('/searchProduct',function(req,res){
		if(req.session.user)
		{
			var name=req.body.txtsearch;
			var price=req.body.txtsearchprice;
			Product.find({name:name,price:price},function(error,result){
				if(error)
					throw error;
				res.render('showProduct',{"productList":result,"username":req.session.user});
			});
		}
		else
		{
			res.redirect('/login');
		}
	});
	app.get('/showProduct',function(req,res){
		if(req.session.user)
		{
			Product.find(function(error,result){
				if(error)
					throw error;
				res.render('showProduct',{'productList':result,"username":req.session.user});
			});			
		}
		else
		{
			res.redirect('/login');
		}
	});

	app.get('/addProduct',function(req,res){
		if(req.session.user)
		{
			res.render('addProduct',{'productList':''});
		}
		else
		{
			res.redirect('/login');
		}
	});

	app.get('/editProduct/:id',function(req,res){
		Product.findById(req.params.id,function(error,result){
			if(error)
				throw error;
			res.render('addProduct',{'productList':result});
		});
	});

	app.post('/submitData',upload.single('pimg'),function(req,res){
		const file=req.file;
		if(!file)
		{
			const error=new Error('not uploaded');
			error.httpStatusCode=400;
			return next(error);
		}

		console.log(req.file.filename);

		var id=req.body.txtid;
		var name=req.body.name;
		var price=req.body.price;
		var sale=req.body.sale;
		var category=req.body.category;
		var pimg=req.file.filename;

		if(id.length>0)
		{
			var newProduct={
				name:name,
				price:price,
				sale:sale,
				category:category,
				pimg:pimg
			};

			Product.findByIdAndUpdate(id,newProduct,function(error,result){
				if(error)
					throw error;
				console.log(newProduct.name + " updated");
			});
		}
		else
		{
			var Product1=new Product({
				name:name,
				price:price,
				sale:sale,
				category:category,
				pimg:pimg
			});

			Product1.save(function(error,result){
				if(error)
					throw error;
				console.log(Product1.name + " inserted");
			});
		}
		res.redirect('/showProduct');
	});

	app.get('/deleteProduct/:id',function(req,res){
		Product.findByIdAndRemove(req.params.id,function(error,result){
			if(error)
				throw error;
			res.redirect('/showProduct');
		});
	});
});

app.listen(3333);

