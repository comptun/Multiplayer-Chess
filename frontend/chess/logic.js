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

function getHorizontalPieceMoves(board, team, maxLength)
{
    let legals = [];
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let piece = board[i][j];
            if (piece != 0) {
                if (colourToTeam(piece[0]) == team && (piece[1] == 'r' || piece[1] == 'q' || piece[1] == 'k')) {

                    for (let k = j; j >= 0; --j) {
                        
                    }


                }
            }
        }
    }
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
                    let start = new Vec2(j, i), end = new Vec2(j, i + offset);
                    if (i + offset <= 8 && i + offset >= 0) {
                        if (j + 1 <= 8) {
                            if (board[i + offset][j + 1] != 0) {
                                legals.push(new Move(start, new Vec2(j + 1, i + offset)))
                            }
                        }
                        if (j - 1 >= 0) {
                            if (board[i + offset][j - 1] != 0) {
                                legals.push(new Move(start, new Vec2(j - 1, i + offset)))
                            }
                        }
                        if (board[i + offset][j] == 0) {
                            legals.push(new Move(start, end));
                        }
                    }
                    if ((getPieceTeam(piece) == 0 && i == 6) || (getPieceTeam(piece) == 1 && i == 1)) { 
                        if (i + (2 * offset) <= 8 && i + (2 * offset) >= 0) {
                            if (board[i + offset][j] == 0 && board[i + (2 * offset)][j] == 0) {
                                legals.push(new Move(start, new Vec2(j, i + (2 * offset))));
                            }
                        }
                    }
                }
            }
        }
    }
    return legals;
}

function isLegalMove(board, move, team)
{
    let piece = board[move.start.y][move.start.x];
    let capturedPiece = board[move.end.y][move.end.x];
    if (getPieceTeam(piece) == team && (move.start.y != move.end.y || move.start.x != move.end.x) && playerColour == team && getPieceTeam(piece) != getPieceTeam(capturedPiece)) {
        if (piece[1] == 'p' && colourToTeam(piece[0]) == team) {
            let moves = getLegalPawnMoves(board, team);
            for (let i = 0; i < moves.length; ++i) {
                if (JSON.stringify(moves[i]) == JSON.stringify(move)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    return false;
}