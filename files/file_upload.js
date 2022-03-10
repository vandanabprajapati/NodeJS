const express=require('express'),
	  bodyParser=require('body-parser'),
	  multer=require('multer');

const storage=multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'./upload');
	},
	filename: function(req,file,callback){
		callback(null,file.fieldname + '-' + Date.now());
	}
});  

const upload=multer({storage:storage},{limits : {fieldNameSize : 10}});
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

//single file upload api 
app.post('/api/photo', upload.array('userPhoto',4), function(req,res,next){
    try{
        const files = req.files;
        if (!files) {
            res.status(400).json({
                "status": "failed",
                "code" : "400",
                "message" : "Please upload file"
            });
        }

        res.status(200).json({
            "status": "success",
            "code" : "200",
            "message" : "file uploaded successfully"
        });
    }catch(err){
        console.log(error.message);
        res.status(200).json({
            "status": "failed",
            "code" : "500",
            "message" : error.message
        });
    }
});

app.listen(5010,function(){
	console.log('Server is running on port 5010');
});