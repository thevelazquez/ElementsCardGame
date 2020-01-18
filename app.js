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
	socket.emit('getPlayers', game.listPlayers());
	if (game.started == false) {
		console.log('made a connection', socket.id)
		socket.emit('name');
		socket.on('name', (name) => {
			if (name == "" || (typeof name != 'string')) {
				socket.emit('noName');
			} else {
				console.log(`${name} has joined the game!`);
				game.addPlayer(name,socket.id);
				let player = game.getPlayer(socket.id);
				socket.emit('getId', player.id);
				io.sockets.emit('getPlayers', game.listPlayers());
			}
		})
	} else {
		socket.emit('lockOut');
	}
	socket.on('isReady', (id) => {
		game.readyPlayer(id);
		io.sockets.emit('update', game.getClientData())
		//console.log(game.debugPlayers())
		if (game.ready) {
			io.sockets.emit('gameStart');
		}
	})
	socket.on('getCards', (id) => {
		let hand = game.getCards(id);
		socket.emit('cardDelivery',hand);
	})
});
