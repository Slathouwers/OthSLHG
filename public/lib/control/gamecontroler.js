/* jshint esversion: 6 */
import GameModel from "../model/game.js";
import OthelloView, {
    SIZE
} from "../view/view.js";
// @ts-ignore
import OthelloEvent from "./event.js";
export default class OthelloControler {
    constructor() {
        this._model = new GameModel();
        this._view = new OthelloView(this._model);


        //Event Listeners
        this._view.onStartClick.attach(
            (sender, event) => this.startNewGame(sender, event)
        );
        this._model.onNewTurn.attach(
            (sender, event) => this.setUpPlayerTurn(sender, event)
        );
        this._view.onUiClick.attach(
            (sender, event) => this.uiClick(sender, event)
        );
    }
    /**
     * @param {OthelloView} sender
     * @param {MouseEvent} event
     */
    uiClick(sender, event) {
        if (this._model.currentPlayer.type == 'Human') {
            let x = event.pageX - sender._uiView.getBoundingClientRect().left;
            let y = event.pageY - sender._uiView.getBoundingClientRect().top;
            let row = Math.floor(y / SIZE);
            let col = Math.floor(x / SIZE);
            this._model.makeMove(row, col);
        }
    }
    /**
     * @param {OthelloView} sender
     * @param {MouseEvent} event
     */
    // @ts-ignore
    startNewGame(sender, event) {
        // @ts-ignore
        this._model.startGame(sender.slctBlack.value, sender.slctWhite.value);
    }
    // @ts-ignore
    setUpPlayerTurn(sender, event) {
        let view = this._view;
        let sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        };
        
        if (sender.currentPlayer.type == "Human") { //human UI refresh
            //Human Case
            view.refresh(`Your turn ${sender.currentPlayer.color.toUpperCase()}...`);
        } else if (sender.currentPlayer.type == "Random AI") {
            //Computer AI view update
            let min = 0;
            let max = sender.possibleMovesList.length;
            let boardMoveIndex = 0;

            if (max > 0) {// index out of bounds error if < 0 and undefined if 0
                let randomMovesIndex = Math.floor(Math.random() * (max - min)) + min;
                boardMoveIndex = sender.possibleMovesList[randomMovesIndex].index;
            }
            
            //Refresh Human AI
            view.refresh(`${sender.currentPlayer.color.toUpperCase()} thinking...`);

            //Simulate thinking
            sleep(1000).then(() => {
                // make move when awake
                sender.makeMove(boardMoveIndex >> 3, boardMoveIndex & 0x07);
                view.refresh(`${sender.currentPlayer.color.toUpperCase()} move made!`);
            });
        } else if (sender.currentPlayer.type == "Simple AI") {
            //Simple AI Case => place maximize casualties for next move
            let max = sender.possibleMovesList.length;
            let moveByAI = {
                'index': 0,
                'arrVulnerables': []
            };
            //find move with biggest number of vulnerables
            if (max > 0) {
                sender.possibleMovesList.forEach(
                    m => {
                        moveByAI = moveByAI.arrVulnerables.length > m.arrVulnerables.length ? moveByAI : m;
                    });
            }

            view.refresh(`${sender.currentPlayer.color.toUpperCase()} thinking...`);
            //Simulate thinking
            sleep(1000).then(() => {
                sender.makeMove(moveByAI.index >> 3, moveByAI.index & 0x07);
                view.refresh(`${sender.currentPlayer.color.toUpperCase()} move made!`);
            });
        }

    }

}