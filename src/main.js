/* jshint esversion: 6 */
const ROWS = 8;
const COLS = 8;
const SIZE = 50;
const EMPTY = '-';
const BLACK = 'B';
const WHITE = 'W';
const BG_COLOR = "green";
const BDR_COLOR = "silver";

class Position {
    constructor() {
        this.pArr = this.getEmptyArray();
        this.gameInit();
    }

    getEmptyArray() {
        let arr = [];
        for (let i = 0; i < ROWS; i++) {
            arr[i] = [];
            for (let j = 0; j < COLS; j++) {
                arr[i][j] = EMPTY;
            }
        }
        return arr;
    }

    gameInit() {
        let startRow = ROWS / 2 - 1;
        let startCol = COLS / 2 - 1;
        this.pArr[startRow][startCol] = WHITE;
        this.pArr[startRow][startCol + 1] = BLACK;
        this.pArr[startRow + 1][startCol] = BLACK;
        this.pArr[startRow + 1][startCol + 1] = WHITE;
    }
}


function othello() {
    "use strict";


    let canvasUi = document.getElementById("ui-layer");
    canvasUi.addEventListener("click", uiClick, false);
    let ctxUi = canvasUi.getContext("2d");

    let canvasGame = document.getElementById("game-layer");
    let ctxGame = canvasGame.getContext("2d");

    let canvasBg = document.getElementById("background-layer");
    let ctxBg = canvasBg.getContext("2d");

    let position = new Position();
    console.log(position);

    drawBg();
    drawGame();
    drawUi();


    function drawGame() {
        let ui = position.pArr;
        let rows = ui.length;
        let cols = ui[0].length;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                let p = ui[i][j];
                if (p != EMPTY) {
                    drawPiece(i, j, p);
                }

            }
        }
    }


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

    function drawPiece(r, c, color) {
        ctxUi.beginPath();
        ctxUi.fillStyle = color === BLACK ? "black" : "white";
        ctxUi.arc(c * SIZE + SIZE / 2, r * SIZE + SIZE / 2, 20, 0, Math.PI * 2);
        ctxUi.fill();
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
}
