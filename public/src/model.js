/* jshint esversion: 6 */


// REFERENCES: 
//          Explaining BitBoard logic used in othello move generation, position evaluation 
//          and further AI implementation
//
//  -> Bitboard concept explained using Chess
//          64-bit bitboards chess: 
//          http://pages.cs.wisc.edu/~psilord/blog/data/chess-pages/rep.html
//
//  -> Othello Move Generation using bitboards
//          Othello Bitboard: 
//          https://www.hanshq.net/othello.html#bitboards (Language: c)
//          
//          Ojthello Move generation: 
//          https://www.hanshq.net/othello.html#bitboards  (Language: c)
//          
//          Othello Position evaluation: 
//          https://www.hanshq.net/othello.html#eval  (Language: c)
//
//  -> Bits and operators in js (operator converts to 32bit numeber!)
//          Bitwise operators in javascript:
//          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
//          
//          32-bit limitation and numbers in js so split board in upper and lower boards and fill up the 
//          counterpart when doing a shiftUp and shiftDown!! 
//
// DISCLAIMER: Class methods take a lot of inspiration from https://github.com/kana/othello-js 
//
//          To the author my gratitude for challenging me to dig deeper into the world of 
//          bitmaps/-boards and expanding my understanding of bitwise operations in general!
//          
//          TO BE HONEST: In my 10 years of (limited) programming experience I never took a second look 
//          at any of the bitwise operators I came across in learning Java, Matlab, Python, C/C++, 
//          Lisp/Racket, C#, Javascript... - I'm glad I finally did :D
//

//Cells can only have 3 states
const CELL_STATES = {
    EMPTY: 'empty',
    BLACK: 'black',
    WHITE: 'white'
};
//DIMS: ROWS = COLUMNS (eg. square of 8x8 has DIMS= 8)
const DIMS = 8;

class BitBoard {
    // split up in upper and lower board: JS 32bit constraint
    // split in White positions and Black positions -> move generation by cardinal and ordinal shifting bitboards 
    constructor() {
        this.blackUpper = 0;
        this.blackLower = 0;
        this.whiteUpper = 0;
        this.whiteLower = 0;
    }

    updateBB(cellsArr){
        let lastUpperRow = (DIMS >> 1) - 1;
        let lastLowerRow = DIMS - 1;
        let maxIndex = DIMS - 1;
        for (let row = 0; row < DIMS; row++) {
            for (let col = 0; col < DIMS; col++) {
                if (row < lastUpperRow+1) {
                    let i = Board.index(row, col);
                    this.blackUpper |= (cellsArr[i] === CELL_STATES.BLACK ? 1 : 0) << (maxIndex - col) << ((lastUpperRow - row) * DIMS);
                    this.whiteUpper |= (cellsArr[i] === CELL_STATES.WHITE ? 1 : 0) << (maxIndex - col) << ((lastUpperRow - row) * DIMS);
                } else {
                    let j = Board.index(row, col);
                    this.blackLower |= (cellsArr[j] === CELL_STATES.BLACK ? 1 : 0) << (maxIndex - col) << ((lastLowerRow - row) * DIMS);
                    this.whiteLower |= (cellsArr[j] === CELL_STATES.WHITE ? 1 : 0) << (maxIndex - col) << ((lastLowerRow - row) * DIMS);
                }
            }
        }
    }
}

class Board {


    // Board.cells can convert to upperboard bitmap and lowerboard bitmap
    constructor() {
        this.cells = this.emptyBoard();
        this.bitBoard = new BitBoard();
        this.setInitialPieces();
    }
    // Board: has cells array where cell-index = row + col * DIMS
    static index(r, c) {
        return (c + r * DIMS);
    }
    
    emptyBoard() {
        let arr = [];
        for (let i = 0; i < DIMS; i++) {
            arr[i] = [];
            for (let j = 0; j < DIMS; j++) {
                arr[Board.index(i, j)] = CELL_STATES.EMPTY;
            }
        }
        return arr;
    }

    setInitialPieces() {
        let row = DIMS >> 1; // bitwise right shift operater = /2
        let col = DIMS >> 1; // bitwise right shift operater = /2
        this.cells[Board.index(row - 1, col - 1)] = CELL_STATES.WHITE;
        this.cells[Board.index(row - 1, col - 0)] = CELL_STATES.BLACK;
        this.cells[Board.index(row - 0, col - 1)] = CELL_STATES.BLACK;
        this.cells[Board.index(row - 0, col - 0)] = CELL_STATES.WHITE;
        this.bitBoard.updateBB(this.cells);

    }
}

class Game {
    constructor() {
        //props
    }
    // methods
}
let b = new Board();
console.log('*');