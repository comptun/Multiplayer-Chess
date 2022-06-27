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
const pcs = document.getElementById("pcs");
const pieces = document.getElementById("pcs").children;


let playerColour;
let mouseX, mouseY

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

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

function makePiecesDraggable()
{
    for (let i = 0; i < pieces.length; ++i) {
        console.log(pieces[i].id);
        $(pieces[i]).draggable();
    }
}

let startX, startY;
let endX, endY;

const mouseUp = (event) => {
    let piece = document.getElementById(event.target.id);
    endX = Math.round(parseInt(piece.style.left) / 75);
    endY = Math.round(parseInt(piece.style.top) / 75);
    board[endY][endX] = board[startY][startX];
    board[startY][startX] = 0;
    socket.emit("movePiece", board);
    paintChessboard();
}

const mouseDown = (event) => {
    let piece = document.getElementById(event.target.id);
    startX = Math.round(parseInt(piece.style.left) / 75);
    startY = Math.round(parseInt(piece.style.top) / 75);
    console.log(startX, " ", startY);
}

pcs.addEventListener('mouseup', mouseUp);
pcs.addEventListener('mousedown', mouseDown);

function handleInit(number) {
    console.log("You are player ", number);
    playerColour = number;
}

function paintChessboard()
{
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (board[i][j] != 0) {
                console.log(board[i][j]);
                let piece = document.getElementById(board[i][j]);
                piece.style.left = 75 * j;
                piece.style.top = 75 * i;
            }
        }
    }
}

function handleGameState(gameState) {
    let gm = JSON.parse(gameState);
    board = gm.board;
}

function newGame() {
    socket.emit('newGame');
    board = [
        ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
        ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
        ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
    ]
    paintChessboard();
}
  
function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    board = [
        ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
        ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
        ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
    ]
    paintChessboard();
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
    makePiecesDraggable();
    paintChessboard();
}

init();