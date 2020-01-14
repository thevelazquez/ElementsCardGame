const Deck = require('./deck.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.turn = [];
		this.started = false;
		this.ready = false;
		console.log("A game has started!\nWaiting for players...");
	}
	addPlayer(plyr,id) {
		const player = new Player();
		player.setName(plyr);
		player.setId(id);
		this.players.push(player);
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
		for (let player of this.players) {
			if (player.ready == true) {
				this.ready = true;
			} else {
				this.ready = false;
			}
		}
		if (this.ready) {
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
		for (let player of this.players) {
			if (player.id == id) {
					player.toggleReady()
					console.log("toggle")
			}
		}
		console.log(id);
	}
	debugPlayers() {
		for (let player of this.players) {
			console.log(player);
		}
	}
}

const deck = new Deck();
module.exports = Game
