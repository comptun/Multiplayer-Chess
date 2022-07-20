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

function getSlidingPieceMoves(board, team, maxLength, pos)
{
    let legals = [];
    let i = pos.y, j = pos.x;
    let piece1 = board[i][j];
    if (piece1 != 0) {
        if (colourToTeam(piece1[0]) == team) {
            let start = new Vec2(j, i)
            let length = 0;
            // left
            for (let k = j - 1; k >= 0 && length < maxLength; --k) {
                let piece = board[i][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
            // right
            length = 0;
            for (let k = j + 1; k <= 7 && length < maxLength; ++k) {
                let piece = board[i][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
            // up
            length = 0;
            for (let k = i - 1; k >= 0 && length < maxLength; --k) {
                let piece = board[k][j];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(j, k)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
            // down
            length = 0;
            for (let k = i + 1; k <= 7 && length < maxLength; ++k) {
                let piece = board[k][j];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(j, k)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
        }
    }
    return legals;
}

function getDriftingPieceMoves(board, team, maxLength, pos)
{
    let legals = [];
    let i = pos.y, j = pos.x;
    let piece1 = board[i][j];
    if (piece1 != 0) {
        if (colourToTeam(piece1[0]) == team) {
            let start = new Vec2(j, i)
            let length = 0;
            // left
            for (let k = j - 1; i - 1 - length >= 0 && k >= 0 && length < maxLength; --k) {
                let piece = board[i - 1 - length][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i - 1 - length)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
            // right
            length = 0;
            for (let k = j + 1; i - 1 - length >= 0 && k <= 7 && length < maxLength; ++k) {
                let piece = board[i - 1 - length][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i - 1 - length)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }

            length = 0;
            // bottom left
            for (let k = j - 1; i + 1 + length <= 7 && k >= 0 && length < maxLength; --k) {
                let piece = board[i + 1 + length][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i + 1 + length)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
            // bottom right
            length = 0;
            for (let k = j + 1; i + 1 + length <= 7 && k <= 7 && length < maxLength; ++k) {
                let piece = board[i + 1 + length][k];
                if (piece != 0) {
                    if (getPieceTeam(piece) == team)
                        break;
                }
                legals.push(new Move(start, new Vec2(k, i + 1 + length)));
                length += 1;
                if (piece != 0) {
                    if (getPieceTeam(piece) != team)
                        break;
                }
            }
        }
    }
    return legals;
}

function getLegalPawnMoves(board, team, pos)
{
    let legals = [];
    let i = pos.y, j = pos.x;
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
    return legals;
}

function getLegalKnightMoves(board, team, pos)
{
    let legals = [];
    let i = pos.y, j = pos.x;
    let piece1 = board[i][j];
    if (piece1 != 0) {
        if (colourToTeam(piece1[0]) == team) {
            let startPos = new Vec2(j, i);
            if (startPos.x + 1 <= 7 && startPos.y - 2 >= 0)
                legals.push(new Move(startPos, new Vec2(startPos.x + 1, startPos.y - 2)));
            if (startPos.x + 2 <= 7 && startPos.y - 1 >= 0)
                legals.push(new Move(startPos, new Vec2(startPos.x + 2, startPos.y - 1)));
            if (startPos.x - 1 >= 0 && startPos.y - 2 >= 0)
                legals.push(new Move(startPos, new Vec2(startPos.x - 1, startPos.y - 2)));
            if (startPos.x - 2 >= 0 && startPos.y - 1 >= 0)
                legals.push(new Move(startPos, new Vec2(startPos.x - 2, startPos.y - 1)));
            if (startPos.x + 1 <= 7 && startPos.y + 2 <= 7)
                legals.push(new Move(startPos, new Vec2(startPos.x + 1, startPos.y + 2)));
            if (startPos.x + 2 <= 7 && startPos.y + 1 <= 7)
                legals.push(new Move(startPos, new Vec2(startPos.x + 2, startPos.y + 1)));
            if (startPos.x - 1 >= 0 && startPos.y + 2 <= 7)
                legals.push(new Move(startPos, new Vec2(startPos.x - 1, startPos.y + 2)));
            if (startPos.x - 2 >= 0 && startPos.y + 1 <= 7)
                legals.push(new Move(startPos, new Vec2(startPos.x - 2, startPos.y + 1)));
        }
    }
    return legals;
}

let capturedPcs = [];

function movePiece(board, move)
{
    capturedPcs.push(board[move.end.y][move.end.x]);
    board[move.end.y][move.end.x] = board[move.start.y][move.start.x];
    board[move.start.y][move.start.x] = 0;
}

function undoMove(board, move)
{
    board[move.start.y][move.start.x] = board[move.end.y][move.end.x]
    board[move.end.y][move.end.x] = capturedPcs[capturedPcs.length - 1];
    capturedPcs.pop();
}

function generatePseudoLegalMoves(board, team)
{
    let legals = [];
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let piece = board[i][j];
            if (piece != 0) {
                if (getPieceTeam(piece) == team) {
                    if (piece[1] == 'p')
                        legals = legals.concat(getLegalPawnMoves(board, team, new Vec2(j, i)));
                    else if (piece[1] == 'r')
                        legals = legals.concat(getSlidingPieceMoves(board, team, 8, new Vec2(j, i)));
                    else if (piece[1] == 'q')
                        legals = legals.concat(getSlidingPieceMoves(board, team, 8, new Vec2(j, i)), getDriftingPieceMoves(board, team, 8, new Vec2(j, i)));
                    else if (piece[1] == 'k')
                        legals = legals.concat(getSlidingPieceMoves(board, team, 1, new Vec2(j, i)), getDriftingPieceMoves(board, team, 1, new Vec2(j, i)));
                    else if (piece[1] == 'b')
                        legals = legals.concat(getDriftingPieceMoves(board, team, 8, new Vec2(j, i)));
                    else if (piece[1] == 'n')
                        legals = legals.concat(getLegalKnightMoves(board, team, new Vec2(j, i)));
                }
            }
        }
    }
    return legals;
}

function getKingPos(board, team)
{
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let piece = board[i][j];
            if (piece != 0) {
                if (getPieceTeam(piece) == team && piece[1] == 'k') {
                    return new Vec2(j, i);
                }
            }
        }
    }
}

function isKingInCheck(board, team, possibleMoves)
{
    let kingPos = getKingPos(board, team);
    for (let move of possibleMoves) {
        if (move.end.x == kingPos.x && move.end.y == kingPos.y) {
            return true;
        }
    }
    return false;
}

function isLegalMove(board, move, team)
{
    let piece = board[move.start.y][move.start.x];
    let capturedPiece = board[move.end.y][move.end.x];
    if (getPieceTeam(piece) == team && (move.start.y != move.end.y || move.start.x != move.end.x) && playerColour == team && getPieceTeam(piece) != getPieceTeam(capturedPiece)) {
        let possibleMoves = generatePseudoLegalMoves(board, team);
        movePiece(board, move);
        let possibleEnemyMoves = generatePseudoLegalMoves(board, !team);
		if (isKingInCheck(board, team, possibleEnemyMoves)) {
			undoMove(board, move);
			return false;
		}
		undoMove(board, move);
        for (let mov of possibleMoves) {
            if (JSON.stringify(mov) == JSON.stringify(move)) {
                if (isKingInCheck(board, team, possibleEnemyMoves)) {
                    movePiece(board, mov);
                    if (isKingInCheck(board, team, possibleEnemyMoves)) {
						undoMove(board, mov);
						return false;
					}
					undoMove(board, mov);
					return true;
                }
                return true;
            }
        }
    }
    return false;
}