//change ip to the host ip
const ip = `localhost:4000`;
let socket = io.connect(`http://${ip}`, { secure: true, reconnection: true, rejectUnauthorized: false });

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//Establish div references
const nameInput = document.getElementById('entry');
const nameSubmit = document.getElementById('submitName');
const entry = document.getElementById('entryBox');
const playersDiv = document.getElementById('playerList');
const startDiv = document.getElementById('start-phase');
const handDiv = document.getElementById('hand');
const statsDiv = document.getElementById('game-stats');
const activeCardDiv = document.getElementById('activeCard');
const playerDiv = document.getElementById('playerHolder');
const metaDiv = document.getElementById('meta');
const wildMenu = document.getElementById('wildContainer');

//Establish dynamic variables
let submitable = false;
let name = () => {return nameInput.value};
let gameData = {
  activeCard: "",
  status: "",
  deckCount: 0,
  turn: 0,
  hand: [],
  players: [],
  activeElement: "",
  wild: false
};

//wild select menu
const wildToggle = () => {
  console.log("toggle wild")
  if (wildMenu.style.top == "-100vh") {
    wildMenu.style.top = "0vh"
  } else {
    wildMenu.style.top = "-100vh"
  }
}

//fix the width of the entry box for smooth styling
let fixWidth = () => {
  entry.style.width = ((entry.offsetWidth - 40)+"px");
  entry.style.opacity = "1";
  wildMenu.style.top = "-100vh";
}
fixWidth();

//checkInput() is called when a user is typing
//checks if the current input is valid
const checkInput = () => {
  if (name() == "") {
    submitable = false;
    nameSubmit.style.backgroundColor = "rgb(200, 200, 200)";
    nameSubmit.style.cursor = "default";
    console.log("No value")
  } else {
    submitable = true;
    nameSubmit.style.backgroundColor = "rgb(66, 135, 245)";
    nameSubmit.style.cursor = "pointer";
  }
}

//Allows for basic removal of an element
const remove = (elem) => {
  elem.style.opacity = "0";
  setTimeout(()=>{
    elem.style.width = "0px"
    elem.style.padding = "0px"
    setTimeout(()=>{
      elem.parentNode.removeChild(elem);
    },1000)
  },200);
}

//rdyUpdate() is called when a user broadcasts that they're ready to start a game
const rdyUpdate = () => {
  let playerQ = document.getElementsByClassName('players');
  for (player of playerQ) {
    if (playerQuerry(player.innerHTML).status) {
      player.style.backgroundColor = 'rgb(166, 255, 185)';
    } else {
      player.style.backgroundColor = 'rgb(255, 185, 179)';
    }
  }
}
//playerQuerry() is used to easily gather the object of a specified player
const playerQuerry = (name) => {
  for (playerObj of gameData.players) {
    if (name == playerObj.name) {
      return playerObj;
    }
  }
}

//Visually updates the client's hand
const showCards = () => {
  handDiv.innerHTML = "";
  for (let card in gameData.hand) {
    let img = findImg(gameData.hand[card],168,224);
    img.addEventListener('click', () => {select(gameData.hand[card])})
    handDiv.appendChild(img);
  }
}

//findImg() querries and constructs a card element
const findImg = (card,width,height) => {
  for (let i in cards) {
    if (card == cards[i]) {
      const img = new Image(width,height);
      img.src = route + src[i] + '.png';
      img.className += 'cards';
      return img;
    }
  }
}

//lists all other players in the game
const displayPlayers = () => {
  statsDiv.innerHTML = "";

  for (let player of gameData.players) {
    if (player.name == name()) {
      continue;
    } else {
      statsDiv.innerHTML += "<div class='player-stats'>" + player.name + " has " + player.handCount + " cards.</div>";
    }
  }
}

//updates all game data
const showGameData = () => {
  activeCardDiv.innerHTML = "";
  metaDiv.innerHTML = gameData.status;
  let img = findImg(gameData.activeCard,168,224);
  activeCardDiv.appendChild(img);
  activeCardDiv.innerHTML += "<br />There are currently " + gameData.deckCount + " cards left.<br />" + gameData.activeElement;
  displayPlayers();
  showCards();
  checkWild();
}

const checkWild = () => {
  if (gameData.wild) {
    wildMenu.style.top = "0vh";
  } else {
    wildMenu.style.top = "-100vh";
  }
}

//socket.emit functions
const submitName = () => {
  if (submitable && name() != "") {
    submitable = false;
    socket.emit('name', name());
    remove(entry);
  }
}

//broadcasts whether you are ready or not
const toggleReady = () => {
  socket.emit('isReady', sessionId);
  //fix later
  //sessionId will be saved in localStorage to aid unwated disconnects
  //socket.emit('isReady', localStorage.getItem('sessionId'));
}
const getGameData = () => {
  socket.emit('getGameData', sessionId);
}

//emits a card that the user selected
const select = (card) => {
  socket.emit('card', card, sessionId);
  console.log(card);
}


//socket event listeners
socket.on('noName', () => {
  window.alert("Not a proper name.\nYour entry has not been made.\n\nYour name must adhere to the following:\n- 15 Characters max\n- Must be a string\n- Must contain at least one character")
})
socket.on('lockOut', () => {
  window.alert("The game has already begun.\nPlease wait for the next one.")
})
socket.on('getId', (id) => {
  //fix later
  sessionId = id;
  localStorage.setItem('sessionId', id);
  window.alert("Please copy your session ID:\n" + localStorage.getItem('sessionId') + "\n\n(You may need this to join back)");
})

//called when a player broadcasts their ready status
socket.on('rdyUpdate', (data) => {
  gameData.players = data;
  rdyUpdate();
})
//USED AT THE BEGINNING OF THE GAME
socket.on('getPlayers', (players) =>{
  gameData.players = players;
  playerDiv.innerHTML = "";
  for (let player in gameData.players) {
    playerDiv.innerHTML += "<div class='players'>" + gameData.players[player] + "</div>";
  }
})
//Obtains all game data
socket.on('recieveGameData', (data) => {
  gameData = data;
  showGameData();
})
socket.on('gameStart', () => {
  remove(startDiv);
  getGameData();
})
socket.on('update', () => {
  getGameData();
})

const route = 'imgs/'
const cards = ['Fire Basic', 'Wind Basic', 'Water Basic', 'Fire Transition', 'Wind Transition', 'Water Transition', 'Fire Attack', 'Wind Attack', 'Water Attack', 'Fire Special', 'Wind Special', 'Water Special', 'Light Wild', 'Dark Wild'];
const src = ['basic-1-fire', 'basic-3-wind', 'basic-2-water', 'c-3-wind', 'c-2-water', 'c-1-fire', 'atk-1-fire', 'atk-3-wind', 'atk-2-water', 'sp-1-fire', 'sp-3-wind', 'sp-2-water', 'wild-7-light', 'wild-8-dark'];
