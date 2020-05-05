class Deck {
	//default method for creating a deck
	constructor() {
		//this deck is an array
		this.deck = [];
		this.reset();
		this.shuffle();
	}
	//Shuffles the deck
	shuffle() {
		const { deck } = this;
		let m = deck.length, i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			[deck[m], deck[i]] = [deck[i], deck[m]];
		}
		//resturns the shuffled cards
		return this;
	}
	//resets the deck
	reset() {
		//makes a blank deck
		this.deck = [];
		//instantiate basic card set
		const elements = ['Fire','Wind',"Water"];
		const abilities = [];
		const wilds = [];
		//function to add multiple elements to abilities
		let dupe = function(arr,ability,x) {
			for (let i=0; i<x; i++) {
				arr.push(ability);
			}
		}
		//adding multiple wilds/abilities
		dupe(abilities,"Basic",15);
		dupe(abilities,"Transition",6);
		dupe(abilities,"Attack",4);
		dupe(abilities,"Special",6);
		dupe(wilds,"Light Wild",4);
		dupe(wilds,"Dark Wild",4);
		//combine all elements and abilities and add to deck
		for (let element in elements) {
			for (let ability in abilities) {
				this.deck.push(`${elements[element]} ${abilities[ability]}`);
			}
		}
		//add all wilds to deck
		for (let wild in wilds) {
			this.deck.push(`${wilds[wild]}`);
		}
	}
	//draws a card from the deck
	draw() {
		let last = this.deck[this.count()-1];
		this.deck.pop();
		return last;
	}
	//Gives count of the deck
	count() {
		return this.deck.length;
	}
}

module.exports = Deck
