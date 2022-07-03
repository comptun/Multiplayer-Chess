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
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
  
    function handleJoinGame(roomName, username, userid) {
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
      state[roomName].player[1].name = username;
      state[roomName].player[1].id = userid;
      emitGameState(roomName, state[roomName]);
    }
  
    function handleNewGame(username, userid) {
      let roomName = makeid(5);
      clientRooms[client.id] = roomName;
      client.emit('gameCode', roomName);
  
      state[roomName] = initGame();
  
      client.join(roomName);
      client.number = 0;
      client.emit('init', 0);
      state[roomName].player[0].name = username;
      state[roomName].player[0].id = userid;
      emitGameState(roomName, state[roomName]);
    }
  
    function handleMove(board) {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      
      state[roomName].board = board;
      state[roomName].currentTeam = !state[roomName].currentTeam
      emitGameState(roomName, state[roomName])
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
  