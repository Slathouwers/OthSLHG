/* jshint esversion: 6 */
import GameModel from "../model/game.js";
import OthelloView, {
    SIZE
} from "../view/view.js";
export default class OthelloControler {
    constructor(dom) {
        this._model = new GameModel();
        this._view = new OthelloView(this._model, dom);

        //Event Listeners
        this._view.onStartClick.attach(
            /**
             * @param {any} sender
             * @param {any} event
             */
            (sender, event) => this.startNewGame(sender, event)
        );
        this._view.onUiClick.attach(
            /**
             * @param {any} sender
             * @param {any} event
             */
            (sender, event) => this.uiClick(sender, event)
        );
    }
    /**
     * @param {OthelloView} sender
     * @param {MouseEvent} event
     */
    uiClick(sender, event) {
        let x = event.pageX - sender._uiView.getBoundingClientRect().left;
        let y = event.pageY - sender._uiView.getBoundingClientRect().top;
        let row = Math.floor(y / SIZE);
        let col = Math.floor(x / SIZE);
        this._model.makeMove(row, col);
    }
    /**
     * @param {OthelloView} sender
     * @param {MouseEvent} event
     */
    startNewGame(sender, event) {
        this._model.startGame();
    }
}