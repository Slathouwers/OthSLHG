/* jshint esversion: 6 */
import Board, {
    CELL_STATES
} from "./board.js";
import OthelloEvent from "../control/event.js";
import Move from "./move.js";

export default class GameModel {
    constructor(blackPlayerType,whitePlayerType) {
        // create new board -> EMPTY
        this.board = new Board();
        // create playerlist to keep track of player stats like score and passing moves
        this.playerList = [{
                'color': 'black',
                'passCounter': 0,
                'pieceCount': 0,
                'type' : blackPlayerType
            },
            {
                'color': 'white',
                'passCounter': 0,
                'pieceCount': 0,
                'type' : whitePlayerType
            }
        ];
        this.roundCounter = 0;
        this.currentPlayer = '';
        this.possibleMovesList = [];
        this.hasStarted=false;
        this.winner='';

        //Events
        this.onStartGame = new OthelloEvent(this);
        this.onMakeMove = new OthelloEvent(this);
        this.onPassMove = new OthelloEvent(this);
        this.onGameWon = new OthelloEvent(this);
    }
    startGame() {
        //Initialize
        this.board._setInitialPieces();
        this.currentPlayer = this.playerList[0];
        this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
        this.hasStarted=true;
        this.judge();
        this.onStartGame.notify();
    }
    /**
     * @param {number} row
     * @param {number} col
     */
    makeMove(row, col) {
        if(this.hasStarted){
            if (this.possibleMovesList.length > 0) {
                let chosenMoveListIndex = this.possibleMovesList.findIndex(e => e.index === Board.index(row, col));
                if (chosenMoveListIndex > -1) { //Move is in possibleMovesList <=> Valid move
                    let choice = this.possibleMovesList[chosenMoveListIndex];
                    this.board = Board.createBoardWithMoveByPlayer(this.board, col, row, choice);
                    this.currentPlayer.passCounter = 0;
                    this.switchPlayer();
                }
            } else if (this.possibleMovesList.length <= 0){
                this.currentPlayer.passCounter++;
                this.switchPlayer();
    
            }
            this.judge();
            this.onMakeMove.notify();
        }
    }
    switchPlayer() {
        this.currentPlayer = this.nextPlayer(this.currentPlayer);
        this.possibleMovesList = [];
        this.possibleMovesList = this.board.listPossibleMoves(this.currentPlayer);
    }
    judge() {
        let n = {};
        n[CELL_STATES.BLACK] = 0;
        n[CELL_STATES.WHITE] = 0;
        n[CELL_STATES.EMPTY] = 0;
        n.winner = '';
        for (var i = 0; i < this.board.cells.length; i++)
            n[this.board.cells[i]]++;
        this.playerList[0].pieceCount=n.black;
        this.playerList[1].pieceCount=n.white;        
        if (n[CELL_STATES.BLACK] > n[CELL_STATES.WHITE]) {
            n.winner = CELL_STATES.BLACK;
        }
        if (n[CELL_STATES.BLACK] < n[CELL_STATES.WHITE]) {
            n.winner = CELL_STATES.WHITE;
        }
        n.winner = 'draw';
        return n;
    }
    /**
     * @param {{ color: string; }} p
     */
    nextPlayer(p) { //--> controller logic - Needs to move
        return p.color === 'black' ? this.playerList[1] : this.playerList[0];
    }
}