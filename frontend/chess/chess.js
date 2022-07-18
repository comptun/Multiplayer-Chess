const BLACK_COLOUR = "#81C600";
const WHITE_COLOUR = "#DEFF9F";

const socket = io('https://chess-online-project-app.herokuapp.com/');

socket.on("gameState", handleGameState);
socket.on("init", handleInit);
socket.on("gameCode", handleGameCode);
socket.on("recieveMessage", handleRecieveMessage);

const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const newGameScreen = document.getElementById('newGameScreen');
const newGameButton = document.getElementById('newGame');
const exitButton = document.getElementById('exit');
const pcs = document.getElementById("pcs");
const pieces = document.getElementById("pcs").children;
const originMessage = document.getElementById("origin-msg");
const chat = document.getElementById("chat");

const usernameInput = document.getElementById('username');
const messageInput = document.getElementById("msg-input");

const pwafButton = document.getElementById('pwaf');
const continueButton = document.getElementById('continue-btn');
const ngButton = document.getElementById('ng-button');
const sendButton = document.getElementById("send-btn");

const pwafMenu = document.getElementById('pwaf-menu');
const mainMenu = document.getElementById('main-menu');
const nameMenu = document.getElementById('set-name-menu');

const p1Name = document.getElementById('p1');
const p2Name = document.getElementById('p2');


let playerColour = 0;
let mouseX, mouseY
let currentTeam;
let capturedPieces = [];

joinGameBtn.addEventListener('click', joinGame);
newGameButton.addEventListener('click', displayNewGameScreen);
exitButton.addEventListener('click', exitNewGame);
pwafButton.addEventListener('click', displayPwafMenu);
continueButton.addEventListener('click', enterUsername);
ngButton.addEventListener('click', newGame);
sendButton.addEventListener('click', sendMessage);

let board = [
    ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
    ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
    ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
];

function displayMessage(message, username, userid)
{
    const messageID = makeid(5);
    $("#origin-msg").clone().attr("id", messageID).appendTo("body");
    const msg = document.getElementById(messageID);
    chat.append(msg);
    msg.innerHTML = "<span class='msg-username'>" + username + "</span>: " + message;
    chat.scrollTop = chat.scrollHeight - chat.getBoundingClientRect().height;
}

function handleRecieveMessage(message, username, userid)
{
    displayMessage(message, username, userid);
}

function sendMessage()
{
    socket.emit("sendMessage", messageInput.value, getCookie("username"), getCookie("userid"));
    messageInput.value = "";
}

function initPieces()
{
    for (let i = 0; i < pieces.length; ++i) {
        $(pieces[i]).draggable();
        pieces[i].style.display = "block";
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
  
function checkCookies() {
    let user = getCookie("username");
    if (user == "") {
        nameMenu.style.display = "block";
        //user = prompt("Please enter your name:", "");
        // if (user != "" && user != null) {
        //     setCookie("username", user, 365);
        // }
    }
}

function enterUsername()
{
    if (usernameInput.value != "" && usernameInput.value != null) {
        nameMenu.style.display = "none";
        setCookie("username", usernameInput.value, 365*100);
        setCookie("userid", makeid(10), 365*100);
    }
}

let startX, startY;
let endX, endY;

const mouseUp = (event) => {
    currentTeam = playerColour;
    if (event.target.id != "pcs") {
        let piece = document.getElementById(event.target.id);
        piece.style.zIndex = "100";
        endX = Math.round(parseInt(piece.style.left) / 75);
        endY = Math.round(parseInt(piece.style.top) / 75);
        if (playerColour == 1) {
            endX = 7 - Math.round(parseInt(piece.style.left) / 75);
            endY = 7 - Math.round(parseInt(piece.style.top) / 75);
        }
        if (isLegalMove(board, new Move(new Vec2(startX, startY), new Vec2(endX, endY)), currentTeam)) {
            if (board[endY][endX] != 0) {
                capturedPieces.push(board[endY][endX]);
                document.getElementById(board[endY][endX]).style.display = "none";
            }
            board[endY][endX] = board[startY][startX];
            board[startY][startX] = 0;
            currentTeam = !currentTeam;
            socket.emit("movePiece", [startX, startY, endX, endY], capturedPieces);
        }
    }
    paintChessboard();
}

const mouseDown = (event) => {
    if (event.target.id != "pcs") {
        let piece = document.getElementById(event.target.id);
        piece.style.zIndex = "1000";
        startX = Math.round(parseInt(piece.style.left) / 75);
        startY = Math.round(parseInt(piece.style.top) / 75);
        if (playerColour == 1) {
            startX = 7 - Math.round(parseInt(piece.style.left) / 75);
            startY = 7 - Math.round(parseInt(piece.style.top) / 75);
        }
    }
}

pcs.addEventListener('mouseup', mouseUp);
pcs.addEventListener('mousedown', mouseDown);

function handleInit(number, gameState) {
    gameState = JSON.parse(gameState);
    console.log("You are player ", number);
    playerColour = number;
    for (let i = 0; i < gameState.messages.length; ++i) {
        displayMessage(gameState.messages[i][0], gameState.messages[i][1], gameState.messages[i][2])
    }
}

function displayNewGameScreen()
{
    newGameScreen.style.display = "block";
    mainMenu.style.display = "block";
    pwafMenu.style.display = "none";
}
function exitNewGame()
{
    newGameScreen.style.display = "none";
}
function displayPwafMenu()
{
    mainMenu.style.display = "none";
    pwafMenu.style.display = "block";
    let id = getParameterByName('id');
    if (id == null || id == "") {
        newGame();
    }
    else {
        gameCodeDisplay.innerText = id;
    }
}


function paintChessboard()
{

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (playerColour == 0) {
                if (board[i][j] != 0) {
                    let piece = document.getElementById(board[i][j]);
                    piece.style.left = 75 * j;
                    piece.style.top = 75 * i;
                }
            }
            else if (playerColour == 1) {
                if (board[i][j] != 0) {
                    let piece = document.getElementById(board[i][j]);
                    piece.style.left = 75 * (7 - j);
                    piece.style.top = 75 * (7 - i);
                }
            }
            else {
                if (board[i][j] != 0) {
                    let piece = document.getElementById(board[i][j]);
                    piece.style.left = 75 * j;
                    piece.style.top = 75 * i;
                }
            }
        }
    }
    for (let i = 0; i < capturedPieces.length; ++i) {
        document.getElementById(capturedPieces[i]).style.display = "none";
    }
}

function handleGameState(gameState) {
    let gm = JSON.parse(gameState);
    board = gm.board;
    currentTeam = gm.currentTeam;
    capturedPieces = gm.capturedPieces;
    console.log(currentTeam);
    if (playerColour == 1) {
        $("#" + gm.movedPiece).animate({
            left: ((7 - gm.lastMove[2]) * 75).toString() + "px",
            top: ((7 - gm.lastMove[3]) * 75).toString() + "px"
        });
        p1Name.innerText = gm.player[1].name;
        p2Name.innerText = gm.player[0].name;
    }
    else {
        $("#" + gm.movedPiece).animate({
            left: (gm.lastMove[2] * 75).toString() + "px",
            top: (gm.lastMove[3] * 75).toString() + "px"
        });
        p1Name.innerText = gm.player[0].name;
        p2Name.innerText = gm.player[1].name;
    }
    paintChessboard()
}

function newGame() {
    socket.emit('newGame', getCookie("username"), getCookie("userid"));
    board = [
        ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
        ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
        ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
    ];
    capturedPieces = [];
    currentTeam = 0;
    initPieces();
    paintChessboard();
    chat.innerHTML = "";
    socket.emit("sendMessage", getCookie("username") + " has joined the game!", "<span class='msg-username'>system</span>", "0");
}
  
function joinGame() {
    exitNewGame();
    const code = gameCodeInput.value;
    socket.emit('joinGame', code, getCookie("username"), getCookie("userid"));
    capturedPieces = [];
    currentTeam = 0;
    initPieces();
    paintChessboard();
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + code;
    window.history.pushState({path:newurl},'',newurl);
    chat.innerHTML = "";
    socket.emit("sendMessage", getCookie("username") + " has joined the game!", "<span class='msg-username'>system</span>", "0");
}

function joinGameUrl(code)
{
    socket.emit('joinGame', code, getCookie("username"), getCookie("userid"));
    capturedPieces = [];
    currentTeam = 0;
    initPieces();
    paintChessboard();
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + code;
    window.history.pushState({path:newurl},'',newurl);
    chat.innerHTML = "";
    socket.emit("sendMessage", getCookie("username") + " has joined the game!", "<span class='msg-username'>system</span>", "0");
}

function move()
{
    const mov = moveInput.value;
    socket.emit("movePiece", mov);
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + gameCode;
    window.history.pushState({path:newurl},'',newurl);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function init()
{
    initPieces();
    paintChessboard();
    checkCookies();
    let id = getParameterByName('id');
    if (id != null) {
        joinGameUrl(id);
    }
}

init();