/* jshint esversion: 6 */
import BitBoard from "./bitboard.js";
import Move from "./move.js";

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
     * source: https://github.com/kana/othello-js 
     * @returns list of open and takeable indexes
     * @param {*} player 
     */
    listPossibleMoves(player) {
        this._logBitsToConsole();
        let moveIndexes = [];
        let moves = [];
        let bb = this.toBitBoard();
        // Offense
        let ou = player.color === 'black' ? bb.blackUpper : bb.whiteUpper;
        let ol = player.color === 'black' ? bb.blackLower : bb.whiteLower;
        // Defense
        let du = player.color === 'black' ? bb.whiteUpper : bb.blackUpper;
        let dl = player.color === 'black' ? bb.whiteLower : bb.blackLower;
        // Empty
        let eu = ~(ou | du); // = Empty upper bits
        let el = ~(ol | dl); // = Empty lower bits
        // Attackable
        let au = 0; //  Attackable upper bits
        let al = 0; //   Attackable lower bits
        let at; //  Attackable bits {upper,lower}

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
    /**
     * @author source: https://github.com/kana/othello-js 
     * @description Combine lower 3 rows of upper bitboard with top row from lower bit board  
     *                      (1) shift upper 32bits 8 bits to the left (replacing last 8bits(=1row) with 0's) and combine by OR'ing
     *                      (2) shift lower 32 bits to the right filling left 3 times 8bits(3rows) up with 0's
     */
    shiftUp(u, l) {
        return (u << 8) | //
            (l >>> (8 * (4 - 1))); // 
    }
    /**
     * @author source: https://github.com/kana/othello-js 
     * @description like shift up but downwards: take lower 3 rows of lower bitboard and replace first row with last row from upper
     */
    shiftDown(u, l) { // 
        return (l >>> 8) |
            ((u & 0x000000ff) << (8 * (4 - 1)));
    }
    /**
     * @author source: https://github.com/kana/othello-js 
     * @description  Shift up the attacking bits 7 times where: 
     *       (1) Defendingbits are AND'ed with shifted attackingbits 
                If attacker bit overlaps with a defender bit 
                the bit places a mark on the tracer boards(tu and tl) where an attack was successfull (AND'ing) 
            (2) Tracerbits are OR'ed with attack results from (1) 
                and survives to attack the next shift where tracer board is combined with attacker board (OR'ing)
                else it is set to 0 in the next shift and only its tracebits remain
            (3) Last step: atack 1 more shift up with the tracer bits 
                but do not attack the defending bits: 
                Attack the empty cells!
                => tracerbits only represent valid attacking series if their next shift attacks an empty cell!
    */
    listAttackableBitsAtUp(ou, ol, _du, _dl, eu, el) {
        let du = _du & 0x00ffffff; //mask out the top defending row: only attackable when empty (see last step)
        let dl = _dl & 0xffffff00; //mask out the bottom row: impossible to attack upwards with nothing


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
            //Last step: atack 1 more shift up with the tracer bits 
            //      but do not attack the defending bits: 
            //      Attack the empty cells!
            //      => tracerbits only represent valid attacking series if their next shift attacks an empty cell!
            upper: eu & this.shiftUp(tu, tl),
            lower: el & this.shiftUp(tl, 0)
        };
    }
    /**
     * @author source: https://github.com/kana/othello-js 
     * @description All shifting series below follow same logic as above but with bitmasks respective to impossible attacks when shifting in the given direction 
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /**
     *  @author source: https://github.com/kana/othello-js
     */
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
    /** @author source: https://github.com/kana/othello-js */
    cellPositionsFromBitBoard(au, al) {
        let positions = [];
        //for every most significant bit in the bitboard:
        //      add the index of the bit to the positionslist
        //      shift the bitboard 1 bit to the left
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
    // Return resulting board from making move at (x,y) 
    static createBoardWithMoveByPlayer(board, x, y, move) {
        let newBoard = board.cells.slice();
        //put new piece on the board
        newBoard[Board.index(y, x)] = move.player.color;
        for (let i = 0; i < move.arrVulnerables.length; i++) {
            //flip all vulnerable(trapped) cells to attacking color 
            newBoard[move.arrVulnerables[i]] = move.player.color; //
        }
        board.cells = newBoard.slice();
        board._bitBoard = new BitBoard();
        board._bitBoard.setTo(board.cells);

        return board;
    }
    // Static boardcell index calculation: cell-index = row + col * DIMS
    static index(r, c) {
        return (c + r * DIMS);
    }
    _logBitsToConsole() {
        this._bitBoard.setTo(this.cells);
        this._bitBoard.log();
    }

}