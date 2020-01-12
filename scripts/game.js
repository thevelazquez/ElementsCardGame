const Deck = require('./deck.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.started = false;
		console.log("A game has started!\nWaiting for players...");
	}
	addPlayer(plyr) {
		const player = new Player();
		player.setName(plyr);
		this.players.push(player);

		if (this.players.length == 3) {
			console.log("Dealing cards");
			this.dealCards();
		}

	}
	listPlayers() {
		console.log("The current players are: ");
		for (let player of this.players) {
			console.log(player.playerName + " holds " + player.showHand());
		}
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
		this.dealCards();
		this.listPlayers();
	}
}

const deck = new Deck();
module.exports = Game
