/* jshint esversion: 6 */

var othelloMVC = (function othelloMVC(othello) {
    'use strict';

    const CELL_STATES = {
        EMPTY: 'empty',
        BLACK: 'black',
        WHITE: 'white'
    };

    const DIMS = 8; //DIMS: ROWS = COLUMNS (eg. square of 8x8 has DIMS= 8)

    class GameModel {
        constructor() {
            this.playerList = [];
            this.currentPlayer = '';
            this.board = new Board();
            this.possibleMovesList = [];
            this.passCounter = 0;
            this.hasWinner = false;

            this.scores = {};

            //Events
            this.onStartGame = new othello.Event(this);
            this.onMakeMove = new othello.Event(this);
            this.onPassMove = new othello.Event(this);
            this.onGameWon = new othello.Event(this);
            this.startGame();
        }
        startGame() {
            //Initialize
            this.board._setInitialPieces();
            this.playerList = ['black', 'white'];
            this.currentPlayer = 'black';
            this.judge(this.board);
            this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
            //Notify
            this.onStartGame.notify();
        }
        makeMove(row, col) {
            if (this.possibleMovesList.length > 0) {
                let chosenMoveListHasIndex = this.possibleMovesList.findIndex(e => e.index === Board.index(row, col));
                if (chosenMoveListHasIndex > -1) {
                    let choice = this.possibleMovesList[chosenMoveListHasIndex];
                    this.board = Board.createBoardWithMoveByPlayer(this.board, col, row, choice);
                    this.possibleMovesList=[];
                    this.judge(this.board);
                    this.currentPlayer = GameModel.nextPlayer(this.currentPlayer);
                    this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
                    
                }

            } else {
                this.passCounter++;
                this.currentPlayer = GameModel.nextPlayer(this.currentPlayer);
                this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
                this.judge(this.board);
            }
            this.onMakeMove.notify();
            // this.hasWinner = this.board.judge();
            // if (this.hasWinner) {
            //     this.onGameWon.notify();
            // } else {
            //     this.onMakeMove.notify();
            // }
        }
        judge(board) {
            let n = {};
            n[CELL_STATES.BLACK] = 0;
            n[CELL_STATES.WHITE] = 0;
            n[CELL_STATES.EMPTY] = 0;
            n.winner = '';
            for (var i = 0; i < board.cells.length; i++)
                n[board.cells[i]]++;
            if (n[CELL_STATES.BLACK] > n[CELL_STATES.WHITE]) {
                n.winner = CELL_STATES.BLACK;
            }
            if (n[CELL_STATES.BLACK] < n[CELL_STATES.WHITE]) {
                n.winner = CELL_STATES.WHITE;
            }
            n.winner = 'draw';
        }
        static nextPlayer(p) {
            return p === 'black' ? 'white' : 'black';
        }
    }
    class Board {
        // Board.cells can convert to upperboard bitmap and lowerboard bitmap
        constructor() {
            this.cells = this._emptyBoard();
            this._bitBoard = new BitBoard();
        }
        // Static boardcell index calculation: cell-index = row + col * DIMS
        static index(r, c) {
            return (c + r * DIMS);
        }
        _logBitsToConsole() {
            this._bitBoard.setTo(this.cells);
            let black = [this._bitBoard.blackUpper, this._bitBoard.blackLower];
            let white = [this._bitBoard.whiteUpper, this._bitBoard.whiteLower];
            console.log('black');
            black.forEach(b => {
                let string = (b >>> 0).toString(2);
                let bit32 = '0'.repeat(32 - string.length).concat(string);
                for (let index = 0; index < 4; index++) {
                    let subs = bit32.substr(index * 8, 8);
                    console.log(subs);
                }
            });
            console.log('white');
            white.forEach(b => {
                let string = (b >>> 0).toString(2);
                let bit32 = '0'.repeat(32 - string.length).concat(string);
                for (let index = 0; index < 4; index++) {
                    let subs = bit32.substr(index * 8, 8);
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
        toBitBoard() {
            this._bitBoard.setTo(this.cells);
            return this._bitBoard;
        }
        setCell(row, col, state) {
            if (state == CELL_STATES.BLACK || CELL_STATES.WHITE || CELL_STATES.EMPTY) {
                this.cells[Board.index(row, col)] = state;
            }
        }
        /**
         * @returns list of open and takeable indexes
         * @param {*} player 
         */
        listPossibleMoves(player) {
            this._logBitsToConsole();
            let moveIndexes = [];
            let moves = [];
            let bb = this.toBitBoard();
            let ou = player === 'black' ? bb.blackUpper : bb.whiteUpper;
            let ol = player === 'black' ? bb.blackLower : bb.whiteLower;
            let du = player === 'black' ? bb.whiteUpper : bb.blackUpper;
            let dl = player === 'black' ? bb.whiteLower : bb.blackLower;
            let eu = ~(ou | du);
            let el = ~(ol | dl);
            let au = 0;
            let al = 0;
            let at;

            at = this.listAttackableBitsAtUp(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            at = this.listAttackableBitsAtRightUp(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            au |= this.listAttackableBitsAtRight(ou, du, eu);
            al |= this.listAttackableBitsAtRight(ol, dl, el);

            at = this.listAttackableBitsAtRightDown(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            at = this.listAttackableBitsAtDown(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            at = this.listAttackableBitsAtLeftDown(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            au |= this.listAttackableBitsAtLeft(ou, du, eu);
            al |= this.listAttackableBitsAtLeft(ol, dl, el);

            at = this.listAttackableBitsAtLeftUp(ou, ol, du, dl, eu, el);
            au |= at.upper;
            al |= at.lower;

            moveIndexes = this.cellPositionsFromBitBoard(au, al);
            moveIndexes.forEach(index => {
                moves.push(new Move(this, index, player));
            });
                
            return moves;
        }
        shiftUp(u, l) {
            return (u << 8) |
                (l >>> (8 * (4 - 1)));
        }

        shiftDown(u, l) {
            return (l >>> 8) |
                ((u & 0x000000ff) << (8 * (4 - 1)));
        }
        listAttackableBitsAtUp(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x00ffffff;
            let dl = _dl & 0xffffff00;
            let tu = du & this.shiftUp(ou, ol);
            let tl = dl & this.shiftUp(ol, 0);
            tu |= du & this.shiftUp(tu, tl);
            tl |= dl & this.shiftUp(tl, 0);
            tu |= du & this.shiftUp(tu, tl);
            tl |= dl & this.shiftUp(tl, 0);
            tu |= du & this.shiftUp(tu, tl);
            tl |= dl & this.shiftUp(tl, 0);
            tu |= du & this.shiftUp(tu, tl);
            tl |= dl & this.shiftUp(tl, 0);
            tu |= du & this.shiftUp(tu, tl);
            tl |= dl & this.shiftUp(tl, 0);
            return {
                upper: eu & this.shiftUp(tu, tl),
                lower: el & this.shiftUp(tl, 0)
            };
        }
        listAttackableBitsAtRightUp(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x007e7e7e;
            let dl = _dl & 0x7e7e7e00;
            let tu = du & (this.shiftUp(ou, ol) >>> 1);
            let tl = dl & (this.shiftUp(ol, 0) >>> 1);
            tu |= du & (this.shiftUp(tu, tl) >>> 1);
            tl |= dl & (this.shiftUp(tl, 0) >>> 1);
            tu |= du & (this.shiftUp(tu, tl) >>> 1);
            tl |= dl & (this.shiftUp(tl, 0) >>> 1);
            tu |= du & (this.shiftUp(tu, tl) >>> 1);
            tl |= dl & (this.shiftUp(tl, 0) >>> 1);
            tu |= du & (this.shiftUp(tu, tl) >>> 1);
            tl |= dl & (this.shiftUp(tl, 0) >>> 1);
            tu |= du & (this.shiftUp(tu, tl) >>> 1);
            tl |= dl & (this.shiftUp(tl, 0) >>> 1);
            return {
                upper: eu & (this.shiftUp(tu, tl) >>> 1),
                lower: el & (this.shiftUp(tl, 0) >>> 1)
            };
        }
        listAttackableBitsAtRight(o, _d, e) {
            let d = _d & 0x7e7e7e7e;
            let t = d & (o >>> 1);
            t |= d & (t >>> 1);
            t |= d & (t >>> 1);
            t |= d & (t >>> 1);
            t |= d & (t >>> 1);
            t |= d & (t >>> 1);
            return e & (t >>> 1);
        }
        listAttackableBitsAtRightDown(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x007e7e7e;
            let dl = _dl & 0x7e7e7e00;
            let tl = dl & (this.shiftDown(ou, ol) >>> 1);
            let tu = du & (this.shiftDown(0, ou) >>> 1);
            tl |= dl & (this.shiftDown(tu, tl) >>> 1);
            tu |= du & (this.shiftDown(0, tu) >>> 1);
            tl |= dl & (this.shiftDown(tu, tl) >>> 1);
            tu |= du & (this.shiftDown(0, tu) >>> 1);
            tl |= dl & (this.shiftDown(tu, tl) >>> 1);
            tu |= du & (this.shiftDown(0, tu) >>> 1);
            tl |= dl & (this.shiftDown(tu, tl) >>> 1);
            tu |= du & (this.shiftDown(0, tu) >>> 1);
            tl |= dl & (this.shiftDown(tu, tl) >>> 1);
            tu |= du & (this.shiftDown(0, tu) >>> 1);
            return {
                upper: eu & (this.shiftDown(0, tu) >>> 1),
                lower: el & (this.shiftDown(tu, tl) >>> 1)
            };
        }
        listAttackableBitsAtDown(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x00ffffff;
            let dl = _dl & 0xffffff00;
            let tl = dl & this.shiftDown(ou, ol);
            let tu = du & this.shiftDown(0, ou);
            tl |= dl & this.shiftDown(tu, tl);
            tu |= du & this.shiftDown(0, tu);
            tl |= dl & this.shiftDown(tu, tl);
            tu |= du & this.shiftDown(0, tu);
            tl |= dl & this.shiftDown(tu, tl);
            tu |= du & this.shiftDown(0, tu);
            tl |= dl & this.shiftDown(tu, tl);
            tu |= du & this.shiftDown(0, tu);
            tl |= dl & this.shiftDown(tu, tl);
            tu |= du & this.shiftDown(0, tu);
            return {
                upper: eu & this.shiftDown(0, tu),
                lower: el & this.shiftDown(tu, tl)
            };
        }
        listAttackableBitsAtLeftDown(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x007e7e7e;
            let dl = _dl & 0x7e7e7e00;
            let tl = dl & (this.shiftDown(ou, ol) << 1);
            let tu = du & (this.shiftDown(0, ou) << 1);
            tl |= dl & (this.shiftDown(tu, tl) << 1);
            tu |= du & (this.shiftDown(0, tu) << 1);
            tl |= dl & (this.shiftDown(tu, tl) << 1);
            tu |= du & (this.shiftDown(0, tu) << 1);
            tl |= dl & (this.shiftDown(tu, tl) << 1);
            tu |= du & (this.shiftDown(0, tu) << 1);
            tl |= dl & (this.shiftDown(tu, tl) << 1);
            tu |= du & (this.shiftDown(0, tu) << 1);
            tl |= dl & (this.shiftDown(tu, tl) << 1);
            tu |= du & (this.shiftDown(0, tu) << 1);
            return {
                upper: eu & (this.shiftDown(0, tu) << 1),
                lower: el & (this.shiftDown(tu, tl) << 1)
            };
        }
        listAttackableBitsAtLeft(o, _d, e) {
            let d = _d & 0x7e7e7e7e;
            let t = d & (o << 1);
            t |= d & (t << 1);
            t |= d & (t << 1);
            t |= d & (t << 1);
            t |= d & (t << 1);
            t |= d & (t << 1);
            return e & (t << 1);
        }

        listAttackableBitsAtLeftUp(ou, ol, _du, _dl, eu, el) {
            let du = _du & 0x007e7e7e;
            let dl = _dl & 0x7e7e7e00;
            let tu = du & (this.shiftUp(ou, ol) << 1);
            let tl = dl & (this.shiftUp(ol, 0) << 1);
            tu |= du & (this.shiftUp(tu, tl) << 1);
            tl |= dl & (this.shiftUp(tl, 0) << 1);
            tu |= du & (this.shiftUp(tu, tl) << 1);
            tl |= dl & (this.shiftUp(tl, 0) << 1);
            tu |= du & (this.shiftUp(tu, tl) << 1);
            tl |= dl & (this.shiftUp(tl, 0) << 1);
            tu |= du & (this.shiftUp(tu, tl) << 1);
            tl |= dl & (this.shiftUp(tl, 0) << 1);
            tu |= du & (this.shiftUp(tu, tl) << 1);
            tl |= dl & (this.shiftUp(tl, 0) << 1);
            return {
                upper: eu & (this.shiftUp(tu, tl) << 1),
                lower: el & (this.shiftUp(tl, 0) << 1)
            };
        }
        cellPositionsFromBitBoard(au, al) {
            let positions = [];

            for (let yu = 0; yu < 4 && au; yu++) {
                for (let xu = 0; xu < 8 && au; xu++) {
                    if (au & 0x80000000)
                        positions.push(Board.index(yu, xu));
                    au <<= 1;
                }
            }

            for (let yl = 4; yl < 8 && al; yl++) {
                for (let xl = 0; xl < 8 && al; xl++) {
                    if (al & 0x80000000)
                        positions.push(Board.index(yl, xl));
                    al <<= 1;
                }
            }

            return positions;
        }

        static createBoardWithMoveByPlayer(board,x, y, move) {
            let newBoard = board.cells.slice();
            newBoard[Board.index(y, x)] = move.player;
            for(let i=0;i<move.arrVulnerables.length;i++) {
                newBoard[move.arrVulnerables[i]] = move.player;
            }
            
            board.cells = newBoard.slice();
            board._bitBoard = new BitBoard();
            board._bitBoard.setTo(board.cells);

            return board;
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
    class Move {
        constructor(board, index, player) {
            this.board = board;
            this.index = index;
            this.player = player;
            this.arrVulnerables = this.listVulnerables();
        }
        listVulnerables() {
            let vulnerableCells = [];

           
            let x = this.index & 0x07;
            let y = this.index >> 3;
            if (this.board.cells[Board.index(y, x)] !== 'empty')
                return vulnerableCells;
             
            let opponent = GameModel.nextPlayer(this.player);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0)
                        continue;
                    for (let i = 1; i < 8; i++) {
                        let nx = x + i * dx;
                        let ny = y + i * dy;
                        if (nx < 0 || 8 <= nx || ny < 0 || 8 <= ny)
                            break;
                        let cell = this.board.cells[Board.index(ny, nx)];
                        if (cell === this.player && 2 <= i) {
                            for (let j = 1; j < i; j++)
                                vulnerableCells.push(Board.index(y + j * dy, x + j * dx));
                            break;
                        }
                        if (cell !== opponent)
                            break;
                    }
                }
            }
            return vulnerableCells;
        }
    }
    //API
    othello.Game = GameModel;
    othello.Board = Board;
    othello.BitBoard = BitBoard;
    othello.Move = Move;



    return othello;
})(othelloMVC || {});