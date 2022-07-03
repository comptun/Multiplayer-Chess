function getPieceTeam(piece)
{
    let pieceArray = [...piece];
    if (pieceArray[0] == 'w')
        return "white";
    return "black"
}

function isLegalMove(board, startX, startY, endX, endY, team)
{
    return "yes";
}