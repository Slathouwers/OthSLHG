/* jshint esversion: 6 */
import Board, {
    CELL_STATES
} from "./board.js";
import OthelloEvent from "../control/event.js";
import Move from "./move.js";

export default class GameModel {
    constructor() {
        /**@type {Board} */
        this.board = undefined;
        this.playerList = [{
                'color': 'black',
                'passCounter': 0,
                'pieceCount': 0,
                'type': undefined
            },
            {
                'color': 'white',
                'passCounter': 0,
                'pieceCount': 0,
                'type': undefined
            }
        ];
        this.currentPlayer = '';
        /** @type {Move[]} */
        this.possibleMovesList = [];
        this.hasStarted = false;
        this.winner = '';

        //Events
        this.onStartGame = new OthelloEvent(this);
        this.onNewTurn = new OthelloEvent(this);
        this.onPassMove = new OthelloEvent(this);
        this.onGameWon = new OthelloEvent(this);
    }
    startGame(blackPlayerType, whitePlayerType) {
        //Initialize Black
        let black = this.playerList[0];
        black.type = blackPlayerType;
        black.passCounter = 0;
        black.pieceCount = 0;
        //Initialize White
        let white = this.playerList[1];
        white.type = whitePlayerType;
        white.passCounter = 0;
        white.pieceCount = 0;
        //Initialize Board
        this.board = new Board();
        this.board._setInitialPieces();
        //Set started property
        this.winner = '';
        this.hasStarted = true;
        //judge gamestate
        this.judge();
        //Set up black to begin
        this.currentPlayer = black;
        this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
        this.onStartGame.notify();
        this.onNewTurn.notify();
    }
    /**
     * @param {number} row
     * @param {number} col
     */
    makeMove(row, col) {
        if (this.hasStarted && !this.winner.length) {
            if (this.possibleMovesList.length > 0) {
                let chosenMoveListIndex = this.possibleMovesList.findIndex(e => e.index === Board.index(row, col));
                if (chosenMoveListIndex > -1) { //Move is in possibleMovesList <=> Valid move
                    let choice = this.possibleMovesList[chosenMoveListIndex];
                    this.board = Board.createBoardWithMoveByPlayer(this.board, col, row, choice);
                    this.currentPlayer.passCounter = 0;
                    this.switchPlayer();
                }
            } else if (this.possibleMovesList.length <= 0) {
                this.onPassMove.notify();
                this.currentPlayer.passCounter++;
                this.switchPlayer();

            }
            this.judge();
        }
    }
    switchPlayer() {
        this.currentPlayer = this.nextPlayer(this.currentPlayer);
        this.possibleMovesList = [];
        this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
        this.onNewTurn.notify();
    }
    judge() {
        let n = {};
        n[CELL_STATES.BLACK] = 0;
        n[CELL_STATES.WHITE] = 0;
        n[CELL_STATES.EMPTY] = 0;
        n.winner = '';
        for (var i = 0; i < this.board.cells.length; i++)
            n[this.board.cells[i]]++;
        this.playerList[0].pieceCount = n.black;
        this.playerList[1].pieceCount = n.white;
        if (!n[CELL_STATES.EMPTY] || (this.playerList[0].passCounter && this.playerList[1].passCounter)) {
            if (n[CELL_STATES.BLACK] > n[CELL_STATES.WHITE]) {
                this.winner = '==> Black won!!';
            } else if (n[CELL_STATES.BLACK] < n[CELL_STATES.WHITE]) {
                this.winner = '==> White won!!';
            } else this.winner = '==> No one won!!';
            this.onGameWon.notify();
        }
    }
    /**
     * @param {{ color: string; }} p
     */
    nextPlayer(p) { //--> controller logic - Needs to move
        return p.color === 'black' ? this.playerList[1] : this.playerList[0];
    }
}