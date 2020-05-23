class Player {
	constructor() {
		this.hand = [];
		this.ready = false;
		this.id = "";
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
			console.log(this.name() + " tried placing a card that does not exist in their hand");
		}
	}
	setName(name) {
		this.playerName = name;
	}
	setId(id) {
		this.id = id;
	}
	toggleReady() {
		if (this.ready) {
			this.ready = false
		} else {
			this.ready = true
		}
	}
	getStats() {
		let count = this.handCount();
		return {
			name: this.playerName,
			status: this.ready,
			handCount: count
		}
	}
	hasCard(card) {
		//let hasCard = false;
		for (let iCard of this.showHand()) {
			if (iCard == card) {
				return true;
			}
		}
		return false
	}
}

module.exports = Player
