/* jshint esversion: 6 */
import Board from "./board.js";
import GameModel from "./game.js";

export default class Move {
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