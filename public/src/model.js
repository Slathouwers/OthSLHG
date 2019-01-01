/* jshint esversion: 6 */

var othelloMVC = (function othelloMVC(othello) {
    'use strict';
    OthelloMVC.GameModel = class oModel {
        constructor() {
            this.playerList = [];
            this.currentPlayer = '';
            this.board = [];
            this.possibleMovesList = [];
            this.passCounter = 0;
            this.hasWinner = false;

            this.startGameEvent = new Event(this);
            this.makeMoveEvent = new Event(this);
            this.passMoveEvent = new Event(this);
            this.gameWonEvent = new Event(this);
        }

        startGame() {
            //Initialize
            this.playerList = ['black', 'white'];
            this.currentPlayer = 'black';
            this.board = new Board();
            this.possibleMovesList = board.listPossibleMoves(currentPlayer);
            //Notify
            this.startGameEvent.notify();
        }

        makeMove(move) {
            if (possibleMovesList.length) {
                this.board.updateWithMoveByPlayer(move, this.currentPlayer);
                this.currentPlayer = nextPlayer();
                this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);

            } else {
                this.passCounter++;
                this.currentPlayer = nextPlayer();
                this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
            }
            this.hasWinner = board.judge();

            if (this.hasWinner) {
                this.gameWonEvent.notify();
            } else {
                this.makeMoveEvent.notify();
            }
        }

        static nextPlayer() {
            return this.player === 'black' ? 'white' : 'black';
        }

    };
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
            this._setInitialPieces();
        }
        // Static boardcell index calculation: cell-index = row + col * DIMS
        static index(r, c) {
            return (c + r * DIMS);
        }

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

        _setInitialPieces() {
            let row = DIMS >> 1; // bitwise right shift operater = /2
            let col = DIMS >> 1; // bitwise right shift operater = /2
            this.setCell(row - 1, col - 1, CELL_STATES.WHITE);
            this.setCell(row - 1, col - 0, CELL_STATES.WHITE);
            this.setCell(row - 0, col - 1, CELL_STATES.WHITE);
            this.setCell(row - 0, col - 0, CELL_STATES.WHITE);
        }

        get BitBoard() {
            this._bitBoard.setTo(this.cells);
            return this._bitBoard;
        }

        setCell(row, col, state) {
            if (state === CELL_STATES.BLACK || CELL_STATES.WHITE) {
                this.cells[index(row, col)] = state;
            }
        }

        listPossibleMoves(player) {
            //TODO: generate moves for player color
        }

        makeAttackedBoard(index, player) {
            //TODO: place piece of player color on board and flip all vulnerable cells
        }
        judge() {
            //TODO: return bool wether or not game is finished or not
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
        _logToConsole(){
            //TODO: log bitboard to console
            // function dec2bin(dec){
            //     return (dec >>> 0).toString(2);
            // }
        }
    }

    //TODO: API public memberlist

    return othello;
})(othelloMVC || {});

