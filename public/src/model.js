/* jshint esversion: 6 */

var othelloMVC = (function othelloMVC(othello) {
    'use strict';

    const CELL_STATES = {
        //Cells can only have 3 states
        EMPTY: 'empty',
        BLACK: 'black',
        WHITE: 'white'
    };

    const DIMS = 8; //DIMS: ROWS = COLUMNS (eg. square of 8x8 has DIMS= 8)

    class GameModel {
        constructor() {
            /** @type {any[] | string[]} */
            this.playerList = [];
            this.currentPlayer = '';
            this.board = new Board();
            /** @type {any[]} */
            this.possibleMovesList = [];
            this.passCounter = 0;
            this.hasWinner = false;

            this.startGameEvent = new othello.Event(this);
            this.makeMoveEvent = new othello.Event(this);
            this.passMoveEvent = new othello.Event(this);
            this.gameWonEvent = new othello.Event(this);
        }

        startGame() {
            //Initialize
            this.playerList = ['black', 'white'];
            this.currentPlayer = 'black';
            this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
            //Notify
            this.startGameEvent.notify();
        }

        /**
         * @param {any} move
         */
        makeMove(move) {
            if (this.possibleMovesList.length) {
                this.board.updateWithMoveByPlayer(move, this.currentPlayer);
                this.currentPlayer = this.nextPlayer();
                this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);

            } else {
                this.passCounter++;
                this.currentPlayer = this.nextPlayer();
                this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
            }
            this.hasWinner = this.board.judge();

            if (this.hasWinner) {
                this.gameWonEvent.notify();
            } else {
                this.makeMoveEvent.notify();
            }
        }

        nextPlayer() {
            return this.currentPlayer === 'black' ? 'white' : 'black';
        }

    }

    class Board {

        // Board.cells can convert to upperboard bitmap and lowerboard bitmap
        constructor() {
            this.cells = this._emptyBoard();
            this._setInitialPieces();
            this._bitBoard = new BitBoard();
        }
        // Static boardcell index calculation: cell-index = row + col * DIMS
        /**
         * @param {number} r
         * @param {number} c
         */
        static index(r, c) {
            return (c + r * DIMS);
        }
        _logBitsToConsole() {
            this._bitBoard.setTo(this.cells);
            let black = [this._bitBoard.blackUpper, this._bitBoard.blackLower];
            let white = [this._bitBoard.whiteUpper, this._bitBoard.whiteLower];
            black.forEach(b => {
                let string = (b >>> 0).toString(2);
                let bit32 = '0'.repeat(32 - string.length).concat(string);
                for (let index = 0; index < 4; index++) {
                    let subs = bit32.substr(index * 8, 8);
                    subs = subs.replace("0", " 0 ");
                    subs = subs.replace("1", ' B ');

                    console.log(subs);
                }
            });
        }

        _emptyBoard() {
            let arr = [];
            for (let row = 0; row < DIMS; row++) {
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
            this.setCell(row - 1, col - 0, CELL_STATES.BLACK);
            this.setCell(row - 0, col - 1, CELL_STATES.BLACK);
            this.setCell(row - 0, col - 0, CELL_STATES.WHITE);
        }

        // get BitBoard() {
        //     this._bitBoard.setTo(this.cells);
        //     return this._bitBoard;
        // }

        /**
         * @param {number} row
         * @param {number} col
         * @param {string} state
         */
        setCell(row, col, state) {
            if (state == CELL_STATES.BLACK || CELL_STATES.WHITE) {
                this.cells[Board.index(row, col)] = state;
            }
        }

        /**
         * @param {any} player
         */
        listPossibleMoves(player) {
            let moves = [];
            //TODO: generate moves for player color
            return moves || [];
        }

        /**
         * @param {any} move
         * @param {any} currentPlayer
         */
        updateWithMoveByPlayer(move, currentPlayer) {
            //TODO: place piece of player color on board and flip all vulnerable cells
            throw new Error("Method not implemented.");
        }
        judge() {
            //TODO: return bool wether or not game is finished or not
            let isFinished;
            return isFinished || false;
        }
    }

    class Move{
        constructor(){
            this.index='';
            this.listOfVulnerables='';
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

        /**
         * @param {string[]} cellsArr
         */
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

    othello.Game = GameModel;
    othello.Board = Board;
    othello.BitBoard=BitBoard;
    othello.Move = Move;
    //TODO: API public memberlist

    let b = new Board();
    b._logBitsToConsole();
    


    return othello;
})(othelloMVC || {});