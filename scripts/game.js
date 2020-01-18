const Deck = require('./deck.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.turn = [];
		this.clientData = [];
		this.started = false;
		this.ready = false;
		console.log("A game has started!\nWaiting for players...");
	}
	addPlayer(plyr,id) {
		if (this.players.length < 8) {
			const player = new Player();
			player.setName(plyr);
			player.setId(id);
			this.players.push(player);
		} else {
			console.log("The game is full");
		}
	}
	listPlayers() {
		let players = [];
		for (let player of this.players) {
			players.push(player.playerName);
		}
		return players;
	}
	dealCards() {
		for (let i = 0; i<7; i++) {
			for (let player of this.players) {
				player.draw(deck.draw());
			}
		}
		console.log(`The deck now contains ${deck.count()} cards`);
	}
	isReady() {
		if (this.players.length > 2) {
			for (let player of this.players) {
				if (player.ready == true) {
					this.ready = true;
				} else {
					this.ready = false;
					console.log("Not all players are ready");
					break;
				}
			}
		} else {
			console.log("Not enough players");
		}
		if (this.ready) {
			console.log("The game is ready!");
			this.dealCards();
		}
	}
	getPlayer(id) {
		for (let player of this.players) {
			if (player.id == id) {
				return player;
			}
		}
	}
	readyPlayer(id) {
		let player = this.getPlayer(id);
		player.toggleReady();
		/*for (let player of this.players) {
			if (player.id == id) {
					player.toggleReady()
					console.log("toggle")
			}
		}*/
		this.isReady();
	}
	debugPlayers() {
		for (let player of this.players) {
			console.log(player);
		}
	}
	getClientData() {
		this.clientData = [];
		for (let player of this.players) {
			this.clientData.push(player.getStats());
		}
		return this.clientData;
	}
	getCards(id) {
		let player = this.getPlayer(id)
		return player.showHand();
	}
}

const deck = new Deck();
module.exports = Game
