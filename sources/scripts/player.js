class Player {
	constructor() {
		this.hand = [];
		this.playerName = "";
	}
	draw(card) {
		this.hand.push(card);
	}
	name() {
		return this.playerName;
	}
	showHand() {
		return this.hand;
	}
	handCount() {
		return this.hand.length
	}
	place(card) {
		const i = this.hand.indexOf(card);
		if (i>-1) {
			this.hand.splice(i,1);
			return card;
		} else {
			return "Card doesn't exist";
		}
	}
	setName(name) {
		this.playerName = name;
	}
}

//module.exports = Player