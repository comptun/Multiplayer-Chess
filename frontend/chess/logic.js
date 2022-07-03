function getPieceTeam(piece)
{
    if (piece[0] == 'w')
        return 0;
    else if (piece[0] == 'b')
        return 1;
    return 2;
}

function isLegalMove(board, startX, startY, endX, endY, team)
{
    let piece = board[startY][startX];
    if (getPieceTeam(piece) == team && (startY != endY || startX != endX) && playerColour == team) {
        return true;
    }
    return false;
}