import { createBoard, markTile, TILE_STATUSES, revealTile, checkIsWinner, checkIsLoser } from "./algorithm.js";

const SIZE = 2;
let NUMBER_OF_MINES = 1;

const board = createBoard(SIZE, NUMBER_OF_MINES);
console.log(board)
const boardElement = document.querySelector('.board');
const minesLeftEl = document.querySelector('[data-mines-count]');
minesLeftEl.innerHTML = NUMBER_OF_MINES
boardElement.style.setProperty('--size', SIZE);

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameOver(board, tile);
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            if (tile.status === TILE_STATUSES.MARKED) {
                NUMBER_OF_MINES--;
            } else {
                NUMBER_OF_MINES++;
            }
            minesLeftEl.innerHTML = NUMBER_OF_MINES
        })
    })
})

function checkGameOver(board, tile) {
    const isWin = checkIsWinner(board, tile, NUMBER_OF_MINES);
    const isLose = checkIsLoser(board, tile);

    if (isWin || isLose) {
        boardElement.addEventListener('click', stopProp, {capture: true});
        boardElement.addEventListener('contextmenu', stopProp, {capture: true});
    }
    if (isWin) {
        minesLeftEl.innerHTML += ' You Won!'
    } else if (isLose) {
        minesLeftEl.innerHTML += ' You lost! Try again.'
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}