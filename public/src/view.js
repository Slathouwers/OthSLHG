/* jshint esversion: 6 */

// IIFE
var othelloMVC = (function othelloMVC(othello) {
    "use strict";

    const SIZE = 50;
    const BG_COLOR = "green";
    const BDR_COLOR = "black";

    //UIView
    class OthelloView {
        /**
         * @param {any} gameModel
         * @param {any} boardCanvasSelector
         * @param {any} uiCanvasSelector
         * @param {any} bgCanvasSelector
         */
        constructor(gameModel, boardCanvasSelector, uiCanvasSelector, bgCanvasSelector) {
            this._model = gameModel;
            this._boardView = boardCanvasSelector;
            this.brdCtx = this._boardView.getContext('2d');
            this._uiView = uiCanvasSelector;
            this._uiView.addEventListener("click", this.uiClick, false);
            this.uiCtx = this._uiView.getContext('2d');
            this._bgView = bgCanvasSelector;
            this.bgCtx = this._bgView.getContext('2d');

            // init
            this.drawBg();
            this.drawBoard();
            //this.drawUi();

            //Event Listeners

        }

        drawUi() {
            throw new Error("Method not implemented.");
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
                    let position = board[othello.Board.index(row,col)];
                    if (position != 'empty') {
                        this.updateCellState(row, col, position);
                    }
                }
            }
        }
        updateCellState(row, col, state) {
            this.brdCtx.beginPath();
            this.brdCtx.fillStyle = state;
            this.brdCtx.arc(row * SIZE + SIZE / 2, col * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
            this.brdCtx.fill();
        }
        uiClick(event) {
            // let x = event.pageX -canvasUi.getBoundingClientRect().left;
            // let y = event.pageY - canvasUi.getBoundingClientRect().top;
            // let row = Math.floor(y / SIZE);
            // let col = Math.floor(x / SIZE);
    
            // position.putPiece(row,col);
            // position.switchPlayerColor();
            // //clear and redraw ui menu
            // clearCanvas(ctxUi);
            // drawUi();
            // //clear and redraw game objects
            // clearCanvas(ctxGame);
            // drawGame();
    
    
        }
    }

    othello.View = OthelloView;
    //--------------------------------------------------------------------------------------
    // let canvasUi = document.getElementById("ui-layer");
    // canvasUi.addEventListener("click", uiClick, false);
    // let ctxUi = canvasUi.getContext("2d");

    // //BoardView
    // let canvasGame = document.getElementById("game-layer");
    // let ctxGame = canvasGame.getContext("2d");

    // //BackgroundView
    // let canvasBg = document.getElementById("background-layer");
    // let ctxBg = canvasBg.getContext("2d");

    // let board = new Board();
    // console.log(board);

    // drawBg();
    // drawGame();
    // drawUi();





    // function drawUi() {
    //     // GAME MENU
    //     // score: White # vs Black #
    //     // Moves # remaining 
    //     // B/W: your move!
    //     //Overlay with posible moves 
    //     //Overlay with changed pieces previous move

    // }

    // function drawBg() {
    //     for (let i = 0; i < COLS; i++) {
    //         for (let j = 0; j < COLS; j++) {
    //             drawBgSquare(i, j);
    //         }
    //     }
    // }



    // function drawBgSquare(r, c) {
    //     ctxBg.beginPath();
    //     ctxBg.fillStyle = BG_COLOR;
    //     ctxBg.strokeStyle = BDR_COLOR;
    //     ctxBg.rect(c * SIZE, r * SIZE, SIZE, SIZE);
    //     ctxBg.stroke();
    //     ctxBg.fill();
    // }

    return othello;
})(othelloMVC || {});