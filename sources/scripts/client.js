var socket = io.connect('http://localhost:4000');
socket.on('name', () => {
  let name = window.prompt("Enter your player name!", "Your name");
  socket.emit('name',name);
})
