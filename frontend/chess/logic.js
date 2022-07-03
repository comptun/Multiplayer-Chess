function getPieceTeam(piece)
{
    piece.split('');
    if (piece[0] == 'w')
        return 0;
    return 1;
}

function isLegalMove(board, startX, startY, endX, endY, team)
{
    return "yes";
}