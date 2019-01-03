/* jshint esversion: 6 */

// IIFE
var othelloMVC = (function othelloMVC(othello) {
    "use strict";

    const SIZE = 50;
    const BG_COLOR = "green";
    const BDR_COLOR = "black";

    class OthelloView {
        constructor(gameModel, boardCanvasSelector, uiCanvasSelector, bgCanvasSelector) {
            //Properties
            this._model = gameModel;
            this._boardView = boardCanvasSelector;
            this.brdCtx = this._boardView.getContext('2d');
            this._uiView = uiCanvasSelector;
            this.uiCtx = this._uiView.getContext('2d');
            this._bgView = bgCanvasSelector;
            this.bgCtx = this._bgView.getContext('2d');
            this.SIZE = SIZE;
            this.onClick = new othello.Event(this);
            // init
            this.drawBg();
            this.drawBoard();
            this.drawUi();
            //Event Listeners
            this._uiView.addEventListener("click", 
            e => this.onClick.notify(e),
            false);

            this._model.onStartGame.attach(
                () => this.refresh('Game Started')
            );
            this._model.onMakeMove.attach(
                () => this.refresh(`Your turn ${this._model.currentPlayer}:`)
            );
            this._model.onPassMove.attach(
                () => this.refresh(`Player couldn't make a move! Your turn ${this._model.currentPlayer}`)
            );
            this._model.onGameWon.attach(
                () => this.refresh(``)
            );

        }
        refresh(message){
            this.clearCanvas(this.uiCtx);
            this.clearCanvas(this.brdCtx);
            this.drawBoard();
            this.drawUi(message);
        }
        drawUi(message) {
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
                this.uiCtx.fillText(move.arrVulnerables.length,c * SIZE+SIZE/2.5, r * SIZE+SIZE/1.5);
            });
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
                    let position = board.cells[othello.Board.index(row, col)];
                    if (position != 'empty') {
                        this.drawCell(row, col, position);
                    }
                }
            }
        }
        drawCell(row, col, state) {
            this.brdCtx.beginPath();
            this.brdCtx.fillStyle = state;
            this.brdCtx.arc(col * SIZE + SIZE / 2, row * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
            this.brdCtx.fill();
        }
        clearCanvas(ctx) {
            ctx.clearRect(0, 0, 400, 400);
        }
        //Eventhandler
    }
    //API
    othello.View = OthelloView;

    return othello;
})(othelloMVC || {});