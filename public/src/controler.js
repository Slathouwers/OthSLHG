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
        uiClick(sender,data){
            console.log(data);
            sender.uiViewClickHandler(data);
            console.log(sender);
        }
    }
    othello.Controler = OthelloControler;
    return othello;
})(othelloMVC || {});