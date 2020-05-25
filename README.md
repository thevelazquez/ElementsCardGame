# ElementsCardGame
A card game made in HTML5

Before running, be sure to make the necessary changes to the `ip` variable located on line 1 of `sources/scripts/client.js`.

## Installation and Setup
1. [Install Node.js](https://nodejs.org/en/) (Be sure your version of node comes with npm)
2. In a command line, navigate into your cloned repository and use `npm install <module>` to install the following node modules:
	* `express`
	* `socket.io`
3. **Optional** Set the `ip` variable on line 1 of `sources/scripts/client.js` to where you will be listening with `express` in `/app.js`
4. Run `/app.js` with `node app.js`
5. Use Firefox or Chrome to navigate to `localhost:4000` (or whatever you specified when following step 3)
**Note:** The game requires at least 3 players to submit and ready up. The most preferable way to quickly test the game yourself is to connect via individual tabs where each tab represents a different player.

## The Rules
Similar to Uno, the goal is to play the appropriate cards, relative to what card is publicly faced up when it's your turn, until your hand is empty. The first person with an empty hand is the winner.
Here are the twists:
* There are 3 types of elements: Water, which is blue; Wind, which is green; and Fire, which is Red.
* In the normal situation, you can only place a card if you have a matching element or a wild card (which will allow you to change the element of the game).
* You can start an attack on the next player if you have an attack card of the matching element to place on top.
* An attack card will force the next player to draw 2 cards and go to the next turn **unless** if they have an attack card **regardless** of the element. Placing consecutive attacck cards will continue until a player can't place another attack card thus resulting in the drawing of 2x the number of consecutive attack cards placed.
* Placing a basic card will have no effect and the game will go on to the next turn.
* Fire special cards will allow you to place another card (inclusively).
* Water special cards behave like wild cards but can only be used if the element is water.
* Wind special cards will reverse the turn rotation of the game 
* Transition cards will take the current element and transition to the element as indicated on the card (bottom to top)

## How to play
When you first connect to the game, you will be asked to enter your name. Once you've submitted a name, click "toggle ready" and wait for the other players to do the same. When all players are ready, the game will start. The current turn will be indicated at the top of the browser window.
After the game has begun and when it's your turn you can:
* Click the appropriate card to place on the "faced up" pile
* If you do not have a card you can play, click the face down card, adjacent to the "face up" pile, to draw cards until you can play.
* If you are being attacked and click on any card that is not another attack card, you will automatically draw the appropriate number of cards.
* If you place down a wild card, a menu will show the three elements. Click on the element you wish to dictate for the next player.

## Known issues
The following issues are addressed and labeled as features waiting to be added to this repo:
* This game does not recognise the win condition of the actual game in real life.
* There are instances where all the cards can be drawn from the game and it will no longer be able to continue.
* You are currently unable to easily rejoin a game instance. Managing to do so may cause unexpected behaviors.
* attempting to draw a card from the deck when the deck is empty will inflate the number of cards you have in hand. (may be adding null elements to the player's hand array)