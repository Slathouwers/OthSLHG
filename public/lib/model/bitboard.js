/* jshint esversion: 6 */
import Board, {
    DIMS,
    CELL_STATES
} from "./board.js";

export default class BitBoard {
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