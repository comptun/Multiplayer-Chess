const BLACK_COLOUR = "#81C600";
const WHITE_COLOUR = "#DEFF9F";

const socket = io('https://snake-project-game.herokuapp.com/');

socket.on("gameState", handleGameState);
socket.on("init", handleInit);

const moveButton = document.getElementById("moveButton");
const moveInput = document.getElementById("moveInput");
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
moveButton.addEventListener("click", move);

let canvas, ctx;
let playerColour;

function handleInit(number) {
    playerColour = number;
}

function paintChessboard(state)
{
    const sizeX = (canvas.width / 8), sizeY = (canvas.height / 8);
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            ctx.fillStyle = BLACK_COLOUR;
            if (i % 2 == j % 2) {
                ctx.fillStyle = WHITE_COLOUR;
            }
            ctx.fillRect(i * sizeX, j * sizeY, (i + 1) * sizeX, (j + 1) * sizeY);
        }
    }
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    if (gameState.lastAction.move != "NULL") {
        console.log(gameState.lastAction.move)
    }
    socket.emit("clearMove");
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
    console.log("moved");
    const mov = moveInput.value;
    socket.emit("movePiece", mov);
}

function init()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 600;
    paintChessboard();
}

init();