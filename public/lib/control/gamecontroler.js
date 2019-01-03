/* jshint esversion: 6 */
import GameModel from "../model/game.js";
import OthelloView, {
    SIZE
} from "../view/view.js";

export default class OthelloControler {
    /**
     * @param {GameModel} model
     * @param {OthelloView} view
     */
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this._view.onClick.attach(
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
}