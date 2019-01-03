/* jshint esversion: 6 */
import Board, {
    CELL_STATES
} from "./board";
import OthelloEvent from "../control/event";
import Move from "./move";

export default class GameModel {
    constructor() {
        /** @type {any[] | string[]} */
        this.playerList = [];
        this.currentPlayer = '';
        this.board = new Board();
        /** @type {Move[]} */
        this.possibleMovesList = [];
        this.passCounter = 0;
        this.hasWinner = false;
        this.scores = {};

        //Events
        this.onStartGame = new OthelloEvent(this);
        this.onMakeMove = new OthelloEvent(this);
        this.onPassMove = new OthelloEvent(this);
        this.onGameWon = new OthelloEvent(this);
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
    /**
     * @param {number} row
     * @param {number} col
     */
    makeMove(row, col) {
        if (this.possibleMovesList.length > 0) {
            let chosenMoveListHasIndex = this.possibleMovesList.findIndex(e => e.index === Board.index(row, col));
            if (chosenMoveListHasIndex > -1) {
                let choice = this.possibleMovesList[chosenMoveListHasIndex];
                this.board = Board.createBoardWithMoveByPlayer(this.board, col, row, choice);
                this.possibleMovesList = [];
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
    /**
     * @param {{ cells: (string | number)[]; }} board
     */
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
    /**
     * @param {string} p
     */
    static nextPlayer(p) { //--> controller logic - Needs to move
        return p === 'black' ? 'white' : 'black';
    }
}