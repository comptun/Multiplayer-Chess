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
    client.on('sendMessage', handleSendMessage);
  
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
      }

      let i = 2;
      if (state[roomName].player[0].id == "" && state[roomName].player[1].id == "") {
        i = Math.floor(Math.random() * 2);
      }
      if (userid == state[roomName].player[0].id || state[roomName].player[0].id == "") {
        i = 0;
      }
      else if (userid == state[roomName].player[1].id || state[roomName].player[1].id == "") {
        i = 1;
      }
  
      clientRooms[client.id] = roomName;
  
      client.join(roomName);
      client.number = i;
      client.emit('init', i, JSON.stringify(state[roomName]));
      if (i < 2) {
        state[roomName].player[i].name = username;
        state[roomName].player[i].id = userid;
      }
      emitGameState(roomName, state[roomName]);
    }
  
    function handleNewGame(username, userid) {
      let roomName = makeid(5);
      clientRooms[client.id] = roomName;
      client.emit('gameCode', roomName);
  
      state[roomName] = initGame();
  
      client.join(roomName);
      client.number = Math.floor(Math.random() * 2);
      client.emit('init', client.number, JSON.stringify(state[roomName]));
      state[roomName].player[client.number].name = username;
      state[roomName].player[client.number].id = userid;
      emitGameState(roomName, state[roomName]);
    }
  
    function handleMove(move, capturedPieces) {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      state[roomName].capturedPieces = capturedPieces;
      state[roomName].board[move[3]][move[2]] = state[roomName].board[move[1]][move[0]];
      state[roomName].board[move[1]][move[0]] = 0;
      state[roomName].currentTeam = !state[roomName].currentTeam;
      state[roomName].lastMove = move;
      state[roomName].movedPiece = state[roomName].board[move[3]][move[2]];
      emitGameState(roomName, state[roomName]);
    }

    function handleSendMessage(message, username, userid) {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      state[roomName].messages.push([message, username, userid]);
      client.emit('recieveMessage', message, username, userid);
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
  