const BLACK_COLOUR = "#81C600";
const WHITE_COLOUR = "#DEFF9F";

const socket = io('https://chess-online-project-app.herokuapp.com/');

socket.on("gameState", handleGameState);
socket.on("init", handleInit);
socket.on("gameCode", handleGameCode);

const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

const wk = document.getElementById("wk");

let playerColour;
let mouseX, mouseY

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
wk.addEventListener('mouseup', mouseDown)

$(function() {  
    $( "#wk" ).draggable();  
}); 

function mouseDown()
{
    wk.style.left = (Math.ceil((parseInt(wk.style.left) + 37) / 75) * 75 - 75).toString().concat("px");
    wk.style.top = (Math.ceil((parseInt(wk.style.top) + 37) / 75) * 75 - 75).toString().concat("px");
    socket.emit("movePiece", [wk.style.left, wk.style.top]);
}

function handleInit(number) {
    console.log("You are player ", number);
    playerColour = number;
}

function paintChessboard()
{
    
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    if (gameState.lastAction.move != "NULL" && gameState.lastAction.colour != playerColour) {
        wk.style.left = gameState.lastAction.move[0];
        wk.style.top = gameState.lastAction.move[1];
    }
    socket.emit("nullMove");
}

function newGame() {
    socket.emit('newGame');
    init();
}
  
function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function move()
{
    const mov = moveInput.value;
    socket.emit("movePiece", mov);
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function init()
{
   
    
}

init();