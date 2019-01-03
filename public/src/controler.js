/* jshint esversion: 6 */
var othelloMVC = (function othelloMVC(othello) {
    "use strict";
    class OthelloControler {
        constructor(model, view) {
            this._model = model;
            this._view = view;
                this._view.onClick.attach(
                    (sender, event) => this.uiClick(sender,event)
                );
            
        }
        uiClick(sender,event){
            let x = event.pageX - sender._uiView.getBoundingClientRect().left;
            let y = event.pageY - sender._uiView.getBoundingClientRect().top;
            let row = Math.floor(y / sender.SIZE);
            let col = Math.floor(x / sender.SIZE);

            this._model.makeMove(row, col);
        }
    }
    othello.Controler = OthelloControler;
    return othello;
})(othelloMVC || {});