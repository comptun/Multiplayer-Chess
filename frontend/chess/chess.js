const BLACK_COLOUR = "#81C600";
const WHITE_COLOUR = "#DEFF9F";

const socket = io('https://chess-online-project-app.herokuapp.com/');

socket.on("gameState", handleGameState);
socket.on("init", handleInit);
socket.on("gameCode", handleGameCode);

const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const newGameScreen = document.getElementById('newGameScreen');
const newGameButton = document.getElementById('newGame');
const exitButton = document.getElementById('exit');
const pcs = document.getElementById("pcs");
const pieces = document.getElementById("pcs").children;

const usernameInput = document.getElementById('username');

const pwafButton = document.getElementById('pwaf');
const continueButton = document.getElementById('continue-btn');
const ngButton = document.getElementById('ng-button');

const pwafMenu = document.getElementById('pwaf-menu');
const mainMenu = document.getElementById('main-menu');
const nameMenu = document.getElementById('set-name-menu');


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

let board = [
    ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
    ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
    ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
]

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
    if (event.target.id != "pcs") {
        let piece = document.getElementById(event.target.id);
        piece.style.zIndex = "100";
        endX = Math.round(parseInt(piece.style.left) / 75);
        endY = Math.round(parseInt(piece.style.top) / 75);
        if (playerColour == 1) {
            endX = 7 - Math.round(parseInt(piece.style.left) / 75);
            endY = 7 - Math.round(parseInt(piece.style.top) / 75);
        }
        if (isLegalMove(board, startX, startY, endX, endY, currentTeam)) {
            if (board[endY][endX] != 0) {
                capturedPieces.push(board[endY][endX]);
                document.getElementById(board[endY][endX]).style.display = "none";
            }
            board[endY][endX] = board[startY][startX];
            board[startY][startX] = 0;
            socket.emit("movePiece", [startX, startY, endX, endY], board, capturedPieces);
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

function handleInit(number) {
    console.log("You are player ", number);
    playerColour = number;
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
    $("#" + gm.movedPiece).animate({
        left: gm.lastMove[2].toString() + "px",
        top: gm.lastMove[3].toString() + "px"
    });
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
    currentTeam = 0;
    initPieces();
    paintChessboard();
}
  
function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code, getCookie("username"), getCookie("userid"));
    capturedPieces = [];
    currentTeam = 0;
    initPieces();
    paintChessboard();
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + code;
    window.history.pushState({path:newurl},'',newurl);
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