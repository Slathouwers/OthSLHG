/* jshint esversion: 6 */

// IIFE
var othelloMVC = (function othelloMVC(othello) {
    "use strict";

    const SIZE = 50;
    const BG_COLOR = "green";
    const BDR_COLOR = "black";

    //UIView
    class OthelloView {
        
        constructor(gameModel, boardCanvasSelector, uiCanvasSelector, bgCanvasSelector) {
            
            this._model = gameModel;

            this._boardView = boardCanvasSelector;
            this._uiView = uiCanvasSelector;
            this._bgView = bgCanvasSelector;

            // init
            this.drawBg();
            this.drawBoard();
            this.drawUi();

            //Event Listeners
            
        }

        drawUi() {
            throw new Error("Method not implemented.");
        }
        drawBg() {
            throw new Error("Method not implemented.");
        }

        drawBoard() {
            let board = this._model.board;
            let dims = 8;
            for (let row = 0; row < dims; row++) {
                for (let col = 0; col < dims; col++) {
                    let p = ui[row][col];
                    if (p != EMPTY) {
                        this.updateCellState(row, col, p);
                    }
                }
            }
        }
        updateCellState(row, col, state) {
            let brdCtx = _boardView.getContext("2d");
            brdCtx.beginPath();
            brdCtx.fillStyle = state;
            brdCtx.arc(row * SIZE + SIZE / 2, col * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
            brdCtx.fill();
        }

    }
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





    function drawUi() {
        // GAME MENU
        // score: White # vs Black #
        // Moves # remaining 
        // B/W: your move!
        //Overlay with posible moves 
        //Overlay with changed pieces previous move

    }

    function drawBg() {
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < COLS; j++) {
                drawBgSquare(i, j);
            }
        }
    }



    function drawBgSquare(r, c) {
        ctxBg.beginPath();
        ctxBg.fillStyle = BG_COLOR;
        ctxBg.strokeStyle = BDR_COLOR;
        ctxBg.rect(c * SIZE, r * SIZE, SIZE, SIZE);
        ctxBg.stroke();
        ctxBg.fill();
    }

    function uiClick(event) {

    }
    return othello;
})(othelloMVC || {});