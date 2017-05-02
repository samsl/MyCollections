var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var fs = require('fs')
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/maomao');

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var Game = mongoose.model('Game', {
        name : String,
        date : Date,
        post : String
    });


app.get('/api/games', function(req,res){
	Game.find(function(err,games){
		if (err)
			res.send(err)
		res.json(games);
	});
});

app.get('/api/games/:id', function(req,res){
	console.log(req.params.id)
	Game.findOne({'_id': req.params.id},function(err,game){
		if (err)
			res.send(err)
		res.json(game);
	});
});

app.post('/api/games', multipartyMiddleware,function(req,res){
	var file = req.files.file;
	console.log(file.path);
	var upload_path = __dirname + "/public/game/" + file.name;

	fs.readFile(file.path, function (err,data){
		fs.writeFile(upload_path,data, function(err){
			if (err){
				console.log(err);
			}else{
				Game.create({
					name: req.body.name,
					date: req.body.date,
					post: file.name,
					done: false
				}, function(err, game){
				if (err)
					res.send(err);

				Game.find(function(err, games){
					if (err)
					res.send(err)
					res.json(games);
				});
			});
			}
			
			
		});
	});

});

app.delete('/api/games/:game_id', function(req,res){
	Todo.remove({
		_id : req.params.game_id
	}, function(err,game){
		if (err)
			res.send(err);
		Todo.find(function(err,games){
			if (err)
				res.send(err)
			res.json(games);
		});
	});
});

app.get('*', function(req,res){
	res.sendfile('./public/index.html');
});
app.listen(8081);
console.log("App listening on port 8081");
