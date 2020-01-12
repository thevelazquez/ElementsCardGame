const ip = `25.9.154.97:4000`;
let socket = io.connect(`http://${ip}`);
socket.on('name', () => {
  let name = window.prompt("Enter your player name!", "Your name");
  socket.emit('name',name);
})
