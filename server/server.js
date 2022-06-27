const io = require('socket.io')({
    cors: {
      origin: "*",
    }
  });
  const { initGame, gameLoop } = require('./game');
  const { makeid } = require('./utils');
  
  const state = {};
  const clientRooms = {};
  
  io.on('connection', client => {
  
    client.on('movePiece', handleMove);
    client.on('nullMove', nullMove);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
  
    function handleJoinGame(roomName) {
      const room = io.sockets.adapter.rooms[roomName];
  
      let allUsers;
      if (room) {
        allUsers = room.sockets;
      }
  
      let numClients = 0;
      if (allUsers) {
        numClients = Object.keys(allUsers).length;
      }
  
      if (numClients === 0) {
        client.emit('unknownCode');
        return;
      } else if (numClients > 1) {
        client.emit('tooManyPlayers');
        return;
      }
  
      clientRooms[client.id] = roomName;
  
      client.join(roomName);
      client.number = 1;
      client.emit('init', 1);
      
      //startGameInterval(roomName);
    }
  
    function handleNewGame() {
      let roomName = makeid(5);
      clientRooms[client.id] = roomName;
      client.emit('gameCode', roomName);
  
      state[roomName] = initGame();
  
      client.join(roomName);
      client.number = 0;
      client.emit('init', 0);
    }
  
    function handleMove(board) {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      
      state[roomName].board = board;
      emitGameState(roomName, state[roomName])
    }

    function nullMove() {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      
      state[roomName].lastAction.move = "NULL";
    }
  });
  
  function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
      //gameLoop(state[roomName]);
      //emitGameState(roomName, state[roomName])
    }, 1000 / 60);
  }
  
  function emitGameState(room, gameState) {
    // Send this event to everyone in the room.
    io.sockets.in(room)
      .emit('gameState', JSON.stringify(gameState));
  }
  
  io.listen(process.env.PORT || 3000);
  