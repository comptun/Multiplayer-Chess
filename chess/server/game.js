module.exports = {
    initGame,
    gameLoop,
}

function initGame()
{
    const state = createGameState()
    return state;
}

function createGameState()
{
    return {
        currentPlayer: 0,
        lastAction: {
            move: "NULL",
            colour: 0,
        },
        board: [
            [0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
    };
}

function gameLoop(state)
{

}