//change ip to the host ip
const ip = `localhost:4000`;
const nameInput = document.getElementById('entry');
const nameSubmit = document.getElementById('submitName');
const entry = document.getElementById('entryBox');
const playersDiv = document.getElementById('playerList');
const handDiv = document.getElementById('hand');
let socket = io.connect(`http://${ip}`);
let submitable = false;
let name = () => {return nameInput.value};
let myHand = {};
let playerList = [];
let playerData = [];
let playerDiv = document.getElementById("playerHolder");

let fixWidth = () => {
  entry.style.width = ((entry.offsetWidth - 40)+"px");
  entry.style.opacity = "1";
}
fixWidth();

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
const update = () => {
  let playerQ = document.getElementsByClassName('players');
  for (player of playerQ) {
    if (playerQuerry(player.innerHTML).status) {
      player.style.backgroundColor = 'rgb(166, 255, 185)';
    } else {
      player.style.backgroundColor = 'rgb(255, 185, 179)';
    }
  }
}
const playerQuerry = (name) => {
  for (playerObj of playerData) {
    if (name == playerObj.name) {
      return playerObj;
    }
  }
}
const showCards = () => {
  handDiv.innerHTML = "";
  for (let card in myHand) {
    findImg(myHand[card]);
  }
}
const findImg = (card) => {
  for (let i in cards) {
    if (card == cards[i]) {
      const img = new Image(168,224);
      img.src = route + src[i] + '.png';
      img.className += 'cards';
      handDiv.appendChild(img);
    }
  }
}
const showPlayers = () => {
  //exclude the client player

  //loop through player data
    //construct player data div
    //Append player data to '#game-stats'
}

//socket.emit functions
const submitName = () => {
  let pName = name();
  if (submitable && name() != "") {
    submitable = false;
    socket.emit('name', pName);
    remove(entry);
  }
}
const toggleReady = () => {
  socket.emit('isReady', sessionId);
  //fix later
  //socket.emit('isReady', localStorage.getItem('sessionId'));
}
const getCards = () => {
  socket.emit('getCards', sessionId);
}

//socket event listeners
socket.on('noName', () => {
  window.alert("Not a proper name.\nYour entry has not been made.")
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
socket.on('update', (data) => {
  playerData = data;
  update();
})
socket.on('getPlayers', (players) =>{
  playerList = players;
  playerDiv.innerHTML = "";
  for (let player in playerList) {
    playerDiv.innerHTML += "<div class='players'>" + playerList[player] + "</div>";
  }
})
socket.on('cardDelivery', (cards) => {
  myHand = cards;
  showCards();
})
socket.on('gameStart', () => {
  remove(playersDiv);
  getCards();
  //showPlayers();
})

const route = 'imgs/'
const cards = ['Fire Basic', 'Wind Basic', 'Water Basic', 'Fire Transition', 'Wind Transition', 'Water Transition', 'Fire Attack', 'Wind Attack', 'Water Attack', 'Fire Special', 'Wind Special', 'Water Special', 'Light Wild', 'Dark Wild'];
const src = ['basic-1-fire', 'basic-3-wind', 'basic-2-water', 'c-3-wind', 'c-2-water', 'c-1-fire', 'atk-1-fire', 'atk-3-wind', 'atk-2-water', 'sp-1-fire', 'sp-3-wind', 'sp-2-water', 'wild-7-light', 'wild-8-dark'];
