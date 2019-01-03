/* jshint esversion: 6 */
import BitBoard from "./bitboard";
import Move from "./move";

export const CELL_STATES = {
    EMPTY: 'empty',
    BLACK: 'black',
    WHITE: 'white'
};
export const DIMS = 8; //DIMS: ROWS = COLUMNS (eg. square of 8x8 has DIMS= 8)
export default class Board {
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

    static createBoardWithMoveByPlayer(board, x, y, move) {
        let newBoard = board.cells.slice();
        newBoard[Board.index(y, x)] = move.player;
        for (let i = 0; i < move.arrVulnerables.length; i++) {
            newBoard[move.arrVulnerables[i]] = move.player;
        }

        board.cells = newBoard.slice();
        board._bitBoard = new BitBoard();
        board._bitBoard.setTo(board.cells);

        return board;
    }

}