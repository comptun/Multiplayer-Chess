function getPieceTeam(piece)
{
    if (piece[0] == 'w')
        return 0;
    else if (piece[0] == 'b')
        return 1;
    return 2;
}
function colourToTeam(colour)
{
    if (colour == 'w')
        return 0;
    else if (colour == 'b')
        return 1;
    return 2;
}

function getLegalPawnMoves(board, team)
{
    let legals = [];
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let piece = board[i][j];
            if (piece != 0) {
                if (colourToTeam(piece[0]) == team && piece[1] == 'p') {
                    let offset = 1;
                    if (piece[0] == 'w') {
                        offset = -1;
                    }
                    if (i + offset <= 8 && i + offset >= 0) {

                    }
                }
            }
        }
    }
}

function isLegalMove(board, start, end, team)
{
    let piece = board[start.y][start.x];
    let capturedPice = board[end.y][end.x];
    if (getPieceTeam(piece) == team && (start.y != end.y || start.x != end.x) && playerColour == team) {
        return true;
    }
    return false;
}