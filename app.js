var express = require('express');
var socket = require('socket.io');
const Game = require('./scripts/game.js');

const game = new Game();

//app setup
var app = express();
var server = app.listen(4000, function(){
	console.log('listening to requests on port 4000');
});

//Static files
app.use(express.static('sources'))

var io = socket(server);
io.on('connection', function(socket){
	console.log('made a connection', socket.id)
	socket.emit('name');
	socket.on('name', (name) => {
		if (name == null) {
			socket.emit('name');
		} else {
			console.log(`${name} has joined the game!`);
			game.addPlayer(name);
		}
	})
});
