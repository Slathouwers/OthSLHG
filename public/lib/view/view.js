/* jshint esversion: 6 */
import OthelloEvent from "../control/event.js";
import Board from "../model/board.js";
import GameModel from "../model/game.js";
export const SIZE = 50;
export const BG_COLOR = "green";
export const BDR_COLOR = "black";
export default class OthelloView {
    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        //Properties
        this._model = gameModel;

        //HTML DOM object binding
        this._boardView = document.getElementById("game-layer");
        // @ts-ignore
        this.brdCtx = this._boardView.getContext('2d');
        this._uiView = document.getElementById("ui-layer");
        // @ts-ignore
        this.uiCtx = this._uiView.getContext('2d');
        this._bgView = document.getElementById("background-layer");
        // @ts-ignore
        this.bgCtx = this._bgView.getContext('2d');
        //game menu items
        this.slctBlack = document.getElementById("slctBlackType");
        this.slctWhite = document.getElementById("slctWhiteType");
        this.btnStart = document.getElementById("btnStart");

        //Events
        this.onStartClick = new OthelloEvent(this);
        this.onUiClick = new OthelloEvent(this);

        // init
        this.drawBg();
        this.drawUi('Choose your settings...');

        //Event Listeners
        this.btnStart.addEventListener("click",
            e => this.onStartClick.notify(e), 
            false);
        this._uiView.addEventListener("click",
            e => this.onUiClick.notify(e),
            false);
        this._model.onStartGame.attach(
            () => this.refresh('Game Started. Your move BLACK')
            );
        this._model.onPassMove.attach(
            () => this.refresh(`Player couldn't make a move! Your turn ${this._model.currentPlayer.color.toUpperCase()}`)
        );
        this._model.onGameWon.attach(
            () => this.refresh(`${this._model.winner}`)
        );
    }
    refresh(message) {
        this.clearCanvas(this.uiCtx);
        this.clearCanvas(this.brdCtx);
        this.drawBoard();
        this.drawUi(message);
    }
    drawUi(message) {
        if(this._model.currentPlayer.type=="Human"){
            //Draw all possible moves
            this._model.possibleMovesList.forEach(move => {
                let c = move.index & 0x07;
                let r = move.index >> 3;
                this.uiCtx.beginPath();
                this.uiCtx.fillStyle = "rgba(236, 195, 74, 0.38)";
                this.uiCtx.strokeStyle = "black";
                this.uiCtx.rect(c * SIZE, r * SIZE, SIZE, SIZE);
                this.uiCtx.stroke();
                this.uiCtx.fill();
                this.uiCtx.fillStyle = "red";
                this.uiCtx.font = "20px Arial";
                this.uiCtx.fillText(move.arrVulnerables.length.toString(), c * SIZE + SIZE / 2.5, r * SIZE + SIZE / 1.5);
            });
        }
        this.uiCtx.fillStyle = "rgb(179, 67, 67)";
        this.uiCtx.font = "20px Arial";
        this.uiCtx.fontWeight="900";
        this.uiCtx.fillText("HINT: \""+message+"\"", 50, 430);
        let bCount = this._model.playerList[0].pieceCount;
        let wCount = this._model.playerList[1].pieceCount;
        this.uiCtx.fillText(`# Black ${bCount}        /       # White ${wCount}`, 50, 450);
        this.uiCtx.fillText(`${this._model.winner}`,50, 480);
    }
    drawBg() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.drawBgSquare(i, j);
            }
        }
    }
    drawBgSquare(r, c) {
        this.bgCtx.beginPath();
        this.bgCtx.fillStyle = BG_COLOR;
        this.bgCtx.strokeStyle = BDR_COLOR;
        this.bgCtx.rect(c * SIZE, r * SIZE, SIZE, SIZE);
        this.bgCtx.stroke();
        this.bgCtx.fill();
    }
    drawBoard() {
        let board = this._model.board;
        let dims = 8;
        for (let row = 0; row < dims; row++) {
            for (let col = 0; col < dims; col++) {
                let occupation = board.cells[Board.index(row, col)];
                if (occupation != 'empty') {
                    this.drawCell(row, col, occupation);
                }
            }
        }
    }
    /**
     * @param {number} row
     * @param {number} col
     * @param {string} state
     */
    drawCell(row, col, state) {
        this.brdCtx.beginPath();
        this.brdCtx.fillStyle = state;
        this.brdCtx.arc(col * SIZE + SIZE / 2, row * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
        this.brdCtx.fill();
    }
    clearCanvas(ctx) {
        ctx.clearRect(0, 0, 500, 500);
    }
}