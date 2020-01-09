const Deck = require('./deck.js');
const Player = require('./player.js');
const readline = require('readline')
const con = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

class Game {
	constructor() {
		let deck = new Deck();
		this.players = [];
		this.setPlayers();
		this.dealCards();
		this.listPlayers();
	}
	setPlayers() {
		let settingPlayers = true;
		while (settingPlayers) {
			let input = "";
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
				player.draw(deck.draw())
			}
		}
	}
}

let game = new Game();