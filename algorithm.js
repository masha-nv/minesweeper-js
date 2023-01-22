export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    MARKED: 'marked',
    NUMBER: 'number'
}

export function createBoard(size, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(size, numberOfMines);
    
    for (let y = 0; y<size; y++) {
        const row = [];
        for (let x = 0; x< size; x++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            row.push({
                y,x,
                 element, 
                 mine: minePositions.some(positionsMatch.bind(null, {y, x})),
                get status(){
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            })
        }
        board.push(row);
    }

    return board;
}

export function markTile(tile) {
    if (tile.status !== TILE_STATUSES.MARKED && tile.status !== TILE_STATUSES.HIDDEN) return;

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else {
        tile.status = TILE_STATUSES.MARKED;
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) return;

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    }
    tile.status = TILE_STATUSES.NUMBER;
    const [adjacentTiles, numberOfMines] = getAdjacentTiles(board, tile);
    if (numberOfMines) {
        tile.element.innerHTML = numberOfMines;
        return;
    } else {
        
        adjacentTiles.forEach(revealTile.bind(null, board))
    }
}

export function checkIsLoser(board, tile) {
    if (tile.status === TILE_STATUSES.MINE) {
        return true;
    }
}

export function checkIsWinner(board, tile, numberOfMines) {
    let totalRevealed = 0;
    const totalTiles = board.length**2;
    board.forEach(row => {
        totalRevealed += row.reduce((acc,curr) => acc += curr.status === TILE_STATUSES.NUMBER || curr.status === TILE_STATUSES.MARKED ? 1 : 0, 0)
    });
    if (totalTiles - totalRevealed === numberOfMines) return true;
    return false;
}


function getMinePositions(size, numberOfMines) {
    const positions = [];

    while (positions.length < numberOfMines) {
        const position = {
            x: randomPosition(size),
            y: randomPosition(size)
        }
        if (!positions.some(positionsMatch.bind(null, position))) {
            positions.push(position)
        }
    }

    return positions;
}

function randomPosition(size) {
    return Math.floor(Math.random()*size)
}

function positionsMatch(a, b) {
    return a.x === b.x && a.y === b.y;
}

function getAdjacentTiles(board, {y, x}) {
    const tiles = []; let mines = 0;
    for (let i = Math.max(0, y-1); i<Math.min(board.length, y+2); i++) {
        for (let j = Math.max(0, x-1); j < Math.min(board.length, x+2); j++) {
            if (i === y && j === x) continue;
            tiles.push(board[i][j]);
            if (board[i][j].mine) mines++;
        }
    }

    return [tiles, mines];
}