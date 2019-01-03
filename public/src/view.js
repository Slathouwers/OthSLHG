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
            // init
            this.drawBg();
            this.drawBoard();
            this.drawUi();
            //Event Listeners
            this._uiView.addEventListener("click", this.uiClick, false);

            this._model.onStartGame.attach(
                () => this.drawBoard()
            );
            this._model.onMakeMove.attach(
                () => this.drawBoard()
            );
            this._model.onPassMove.attach(
                () => this.drawBoard()
            );
            this._model.onGameWon.attach(
                () => this.drawBoard()
            );

        }
        drawUi() {
            
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
                    let position = board[othello.Board.index(row, col)];
                    if (position != 'empty') {
                        this.drawCell(row, col, position);
                    }
                }
            }
        }
        drawCell(row, col, state) {
            this.brdCtx.beginPath();
            this.brdCtx.fillStyle = state;
            this.brdCtx.arc(row * SIZE + SIZE / 2, col * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
            this.brdCtx.fill();
        }
        clearCanvas(ctx) {
            ctx.clearRect(0, 0, 400, 400);
        }
        //Eventhandler
        uiClick(event) {
            let x = event.pageX - this._uiView.getBoundingClientRect().left;
            let y = event.pageY - this._uiView.getBoundingClientRect().top;
            let row = Math.floor(y / SIZE);
            let col = Math.floor(x / SIZE);

            this._model.board.setCell(row, col, this._model.currentPlayer);
            this._model.nextPlayer();
            //clear and redraw ui menu
            this.clearCanvas(this.uiCtx);
            this.drawUi();
            //clear and redraw game objects
            this.clearCanvas(this.brdCtx);
            this.drawBoard();
        }
    }
    //API
    othello.View = OthelloView;

    return othello;
})(othelloMVC || {});