//const Deck = require('./deck.js');
//const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.setPlayers();
		this.dealCards();
		this.listPlayers();
	}
	setPlayers() {
		let settingPlayers = true;
		while (settingPlayers) {
			let input = prompt(`Enter a player name.\nType "done" when all players have been added.`);
			if (input != "done") {
				const player = new Player();
				player.setName(input);
				this.players.push(player);
			} else {
				settingPlayers = false;
			}
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
				//const card = deck.draw();
				player.draw(deck.draw());
			}
		}
		console.log(`The deck now contains ${deck.count()} cards`);
	}
}

const deck = new Deck();
const game = new Game();