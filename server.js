//Node Sever//

//Require NPMs to run Combinr//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

//Connection to the MongoDB
var database = {
	
	local : '',
	remote : process.env.MONGODB
}

//select the DB connection
var selectDb = database.remote;
mongoose.connect(selectDb);

db = mongoose.connection;

db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});
db.once('open', function () {
	console.log('DB connection: ', selectDb);
});
var PORT = process.env.PORT || 8080; // Sets an initial port. We'll use this later in our listener

//Require Schemas for the DB
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

//-----------Routes-----------//

//Grab the title, link and img of articles from The Verge, TechCrunch and CNet
app.get('/scrape1', function(req, res){
    
	    request('https://techcrunch.com/', function(error, response, html) {
   		var $ = cheerio.load(html);
    
	    	$('.post-title').each(function(i, element) {
					var result2 = {};
					
					result2.title = $(this).find('a').text()
					result2.link = $(this).find('a').attr('href');
					result2.src = 1;
					//result2.img = $(this).parent().find('.thumb').children('img').attr('data-src')
					
					//console.log(result2);
					var entry = new Article (result2);
					entry.save(function(err, doc) {
					  if (err) {
					    console.log(err);
					  } 
					})
			
					
	    	})   	


		  
		})
		request('http://www.theverge.com/tech', function(error, response, html) {
   		var $ = cheerio.load(html);
    
	    	$('.m-entry-slot__content').each(function(i, element) {
					var result1 = {};

					result1.title = $(this).children('h3').find('a').text();
					result1.link = $(this).children('h3').find('a').attr('href');
					result1.src = 2;

					var entry = new Article (result1);
					entry.save(function(err, doc) {
					  if (err) {
					    console.log(err);
					  } 
					})
				
	    	}) 
	    		  
		})
		request('http://www.cnet.com/news/', function(error, response, html) {
   		var $ = cheerio.load(html);
    
	    	$('.assetText').each(function(i, element) {
					var result3 = {};

					result3.title = $(this).children('.assetHed').text();
					result3.link = "http://www.cnet.com" + $(this).children('.assetHed').attr('href');
					result3.src = 3;
					var entry = new Article (result3);
					entry.save(function(err, doc) {
					  if (err) {
					    console.log(err);
					  } 
					})
	    	})    
		  	Article.find({}, function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.json(doc);
				}
			})  
		})

});

//retrieve article for id 
app.get('/articles/:id', function(req, res){

	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
	
});

//add the note id to the article document
app.post('/savenote/:id', function(req, res){
	console.log(req.body)
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});

//delete the note
app.post('/deletenote/:id', function(req, res){
			Article.find({'_id': req.params.id}, 'note', function(err,doc){
				if (err){
					console.log(err);
				}
					Note.find({'_id' : doc[0].note}).remove().exec(function(err,doc){
						if (err){
							console.log(err);
						}
					});
				
			});
			Article.findOneAndUpdate({'_id': req.params.id}, {$unset : {'note':1}})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
});



//start express server
app.listen(PORT, function() {
    console.log("Server listening on PORT: " + PORT);
});
