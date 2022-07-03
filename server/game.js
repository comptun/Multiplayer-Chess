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
        player: [
            {
                name: "",
                id: "",
            },
            {
                name: "",
                id: "",
            },
        ],
        lastAction: {
            move: "NULL",
            colour: 0,
        },
        board: [
            ['br1','bn1','bb1','bq1','bk1','bb2','bn2','br2'],
            ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
            ['wr1','wn1','wb1','wq1','wk1','wb2','wn2','wr2'],
        ],
    };
}

function gameLoop(state)
{

}