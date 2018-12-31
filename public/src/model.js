/* jshint esversion: 6 */

var othelloMVC = (function othelloMVC(othello) {
    'use strict';

    //Cells can only have 3 states
    const CELL_STATES = {
        EMPTY: 'empty',
        BLACK: 'black',
        WHITE: 'white'
    };
    //DIMS: ROWS = COLUMNS (eg. square of 8x8 has DIMS= 8)
    const DIMS = 8;


    class Board {
        // Board.cells can convert to upperboard bitmap and lowerboard bitmap
        constructor() {
            this.cells = this._emptyBoard();
            this._bitBoard = new BitBoard();
            //Events
            this.onCellChanged = new othello._Event(this);
            //Init
            this._setInitialPieces();
        }
        // Static boardcell index calculation:
        // cell-index = row + col * DIMS
        static index(r, c) {
            return (c + r * DIMS);
        }
        //Board Init
        _emptyBoard() {
            let arr = [];
            for (let row = 0; row < DIMS; row++) {
                arr[row] = [];
                for (let col = 0; col < DIMS; col++) {
                    arr[Board.index(row, col)] = CELL_STATES.EMPTY;
                }
            }
            return arr;
        }
        //Board starting set up
        _setInitialPieces() {
            let row = DIMS >> 1; // bitwise right shift operater = /2
            let col = DIMS >> 1; // bitwise right shift operater = /2
            this.setCell(row - 1, col - 1, CELL_STATES.WHITE);
            this.setCell(row - 1, col - 0, CELL_STATES.WHITE);
            this.setCell(row - 0, col - 1, CELL_STATES.WHITE);
            this.setCell(row - 0, col - 0, CELL_STATES.WHITE);
        }

        get BitBoard(){
            this._bitBoard.setTo(this.cells);
            return this._bitBoard;
        }
        //Private cell setter method triggering an onChanged event
        setCell(row, col, state) {
            if (state === CELL_STATES.BLACK || CELL_STATES.WHITE) {
                this.cells[index(row, col)] = state;
                this.onCellChanged.notify({
                    row: row,
                    col: col,
                    state: state
                });
            }
        }
    }

    class BitBoard {
        // split up in upper and lower board: JS 32bit constraint
        // split in White positions and Black positions -> move generation by cardinal and ordinal shifting bitboards 
        constructor() {
            this.blackUpper = 0;
            this.blackLower = 0;
            this.whiteUpper = 0;
            this.whiteLower = 0;
        }

        setTo(cellsArr) {
            let lastUpperRow = (DIMS >> 1) - 1;
            let lastLowerRow = DIMS - 1;
            let maxIndex = DIMS - 1;
            for (let row = 0; row < DIMS; row++) {
                for (let col = 0; col < DIMS; col++) {
                    if (row < lastUpperRow + 1) {
                        let cellIndex = Board.index(row, col);
                        this.blackUpper |= (cellsArr[cellIndex] === CELL_STATES.BLACK ? 1 : 0) << (maxIndex - col) << ((lastUpperRow - row) * DIMS);
                        this.whiteUpper |= (cellsArr[cellIndex] === CELL_STATES.WHITE ? 1 : 0) << (maxIndex - col) << ((lastUpperRow - row) * DIMS);
                    } else {
                        let cellIndex = Board.index(row, col);
                        this.blackLower |= (cellsArr[cellIndex] === CELL_STATES.BLACK ? 1 : 0) << (maxIndex - col) << ((lastLowerRow - row) * DIMS);
                        this.whiteLower |= (cellsArr[cellIndex] === CELL_STATES.WHITE ? 1 : 0) << (maxIndex - col) << ((lastLowerRow - row) * DIMS);
                    }
                }
            }
        }
    }
    class Game {
        constructor() {
            this.playerList = [];
            this.board = new Board();
            this.turn = new turn();

            //Events

        }
        // methods
    }

    class turn{
        constructor(player, possibleMoves){
            this.player = player;
            this.moves = possibleMoves;

        }
    }

    return othello;
})(othelloMVC || {});