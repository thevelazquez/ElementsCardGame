const Deck = require('./deck.js');
const Player = require('./player.js');

class Game {
	constructor() {
		this.players = [];
		this.clientData = [];
		this.turn = 0;
		this.gamePile = [];
		this.activeElement = "";
		this.activeType = "";
		this.started = false;
		this.ready = false;
		this.reverse = false;
		this.wildMode = false;
		this.status = "";
		this.attackBuffer = 0;
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
			this.setActiveAttributes(this.cardType(this.getActive()), this.cardElem(this.getActive()))
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
			players: this.getClientData(),
			activeElement: this.activeElement
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
	checkTurn(card, id) {
		const exception = ['Draw', 'Fire', 'Water', 'Wind'];
		if (id == this.getTurn().id && (this.getPlayer(id).hasCard(card) || exception.indexOf(card) != -1)) {
			return true;
		}
		return false;
	}
	cardEval(card, id) {
		let player = this.getPlayer(id);
		let uType = this.cardType(card);
		let uElem = this.cardElem(card);
		//parse the card on the top of the game pile
		let gType = this.cardType(this.getActive());
		let gElem = this.cardElem(this.getActive());
		let getActiveElement = () => {return this.activeElement};
		let getActiveType = () => {return this.activeType};

		const elements = ['Fire', 'Water', 'Wind'];
		if (this.wildMode) {
			if (elements.indexOf(card) != -1) {
				this.activeElement = card;
				this.wildMode = false;
				this.nextTurn();
			} else {
				console.log("Wild mode is active, plesase select an element");
			}
		} else if (this.attackBuffer != 0 && (card == "Draw" || uType != "Attack")) {
			console.log(player.name() + " has been attacked: draw " + this.attackBuffer + " cards.");
			for (this.attackBuffer; this.attackBuffer > 0; this.attackBuffer--) {
				player.draw(deck.draw());
				console.log(player.name() + " draws a card");
			}
		} else if (card == "Draw") {
				player.draw(deck.draw());
		} else if (uElem == getActiveElement() || uType == "Transition" || uType == "Wild" || (getActiveType() == "Attack" && uType == "Attack" && this.attackBuffer != 0)) {
			switch (uType) {
				case "Basic":
				console.log("Basic card, nothing happens");
				this.gamePile.push(player.place(card));
				this.nextTurn();
				break;
				case "Attack":
				this.attackBuffer++;
				this.gamePile.push(player.place(card));
				this.nextTurn();
				break;
				case "Transition":
				if (uElem == "Water" && getActiveElement() == "Fire") {
					this.gamePile.push(player.place(card));
					this.nextTurn();
				} else if (uElem == "Fire" && getActiveElement() == "Wind") {
					this.gamePile.push(player.place(card));
					this.nextTurn();
				} else if (uElem == "Wind" && getActiveElement() == "Water") {
					this.gamePile.push(player.place(card));
					this.nextTurn();
				} else {
					console.log("Invalid transition card; Cannot be placed");
				}
				break;
				case "Special":
				if (uElem == "Fire") {
					this.gamePile.push(player.place(card));
				} else if (uElem == "Wind") {
					this.gamePile.push(player.place(card));
					if (this.reverse) {
						this.reverse = false;
					} else {
						this.reverse = true;
					}
					this.nextTurn();
				} else if (uElem == "Water") {
					this.gamePile.push(player.place(card));
					this.wildMode = true;
				}
				break;
				case "Wild":
				this.gamePile.push(player.place(card));
				this.wildMode = true;
				break;
			}
			//fix player.place() to check if player has the card
			console.log(player.name() + " submitted " + card)
			this.setActiveAttributes(uType, uElem);
		} else {
			console.log(card + " cannot be placed");
			console.log("Active type: " + getActiveType());
			console.log("Active Element: " + getActiveElement());
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
	setActiveAttributes(type, element) {
		console.log("Setting attributes: " + type + " " + element)

		this.activeType = type;
		this.activeElement = element;

		console.log("Active attributes set...")
		console.log("Active type: " + this.activeType)
		console.log("Active Element: " + this.activeElement)
	}

}

const deck = new Deck();
module.exports = Game
