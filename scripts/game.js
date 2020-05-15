const Deck = require('./deck.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.clientData = [];
		this.turn = 0;
		this.gamePile = [];
		this.started = false;
		this.ready = false;
		this.reverse = false;
		this.status = "";
		console.log("A game has started!\nWaiting for players...");
	}

	//constructs and returns an array of all player names
	listPlayers() {
		let players = [];
		for (let player of this.players) {
			players.push(player.playerName);
		}
		return players;
	}

	//deals 7 cards to each player
	dealCards() {
		for (let i = 0; i<7; i++) {
			for (let player of this.players) {
				player.draw(deck.draw());
			}
		}
		console.log(`The deck now contains ${deck.count()} cards`);
	}

	//checks if the game is ready begin
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
			this.gamePile.push(deck.draw());
			this.pickTurn();
			console.log("It is currently " + this.getTurn().name() + "'s turn.");
		}
	}

	//logs all player objects
	debugPlayers() {
		for (let player of this.players) {
			console.log(player);
		}
	}

	//Packs and sends all the necessary information to each client
	getClientData() {
		this.clientData = [];
		for (let player of this.players) {
			this.clientData.push(player.getStats());
		}
		return this.clientData;
	}

	//client specific
	addPlayer(plyr, id) {
		if (this.players.length < 8) {
			const player = new Player();
			player.setName(plyr);
			player.setId(id);
			this.players.push(player);
		} else {
			console.log("The game is full");
		}
	}

	//currently not in use
	getName(id) {
		let player = this.getPlayer(id);
		return player.name();
	}

	//refreshes the client player's hand
	getCards(id) {
		let player = this.getPlayer(id);
		return player.showHand();
	}

	//toggles the readiness of a player
	//tells the game to check if it can start
	readyPlayer(id) {
		let player = this.getPlayer(id);
		player.toggleReady();
		this.isReady();
	}

	//Querries a player by id
	getPlayer(id) {
		for (let player of this.players) {
			if (player.id == id) {
				return player;
			}
		}
	}

	//Returns all data related to the game for the specified client
	getGameData(id) {
		return {
			activeCard: this.getActive(),
			status: this.status,
			deckCount: deck.count(),
			turn: this.turn,
			hand: this.getCards(id),
			players: this.getClientData()
		}
	}

	//randomly select a player to start the game
	pickTurn() {
		let lastPlayer = this.players.length - 1;
		this.turn = Math.floor(Math.random() * lastPlayer);
		this.status = "It is currently " + this.getTurn().name() + "'s turn.";
	}
	//iterates to the next player of the game
	nextTurn() {
		console.log("\nThere are " + this.players.length + " players and the current turn = " + this.turn)
		if (this.reverse) {
			console.log("Game is in reverse");
			if (this.turn == 0) {
				console.log("setting turn to the last player");
				this.turn = this.players.length - 1;
			} else {
				console.log("subtracting from the turn");
				this.turn--;
			}
		} else {
			console.log("Game is not in reverse ");
			if (this.players[this.turn + 1] == null) {
				console.log("setting turn to 0");
				this.turn = 0;
			} else {
				console.log("adding to the turn");
				this.turn++;
			}
		}
		this.status = "It is currently " + this.getTurn().name() + "'s turn.";
	}
	//Returns the player of the current turn
	getTurn() {
		return this.players[this.turn];
	}
	//checks if the given player maches the player of the current turn
	checkTurn(id) {
		let turn = false
		if (id == this.getTurn().id) {
			turn = true;
		}
		return turn;
	}
	cardEval(card, id) {
		let player = this.getPlayer(id);
		let uType = this.cardType(card);
		let uElem = this.cardElem(card);
		let gType = this.cardType(this.getActive());
		let gElem = this.cardElem(this.getActive());
		if (uElem == gElem || uType == "Wild") {
			this.gamePile.push(player.place(card));
			this.nextTurn();
			console.log(player.name() + " submitted " + card)
		} else {
			console.log(card + " cannot be placed");
		}
	}
	getActive() {
		return this.gamePile[this.gamePile.length-1]
	}
	cardElem(card) {
		return card.split(" ")[0]
	}
	cardType(card) {
		return card.split(" ")[1]
	}

}

const deck = new Deck();
module.exports = Game
