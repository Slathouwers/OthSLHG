/* jshint esversion: 6 */
/*
***************
* GAME MODEL *
***************
*/

// Singleton Othello in global scope
var Othello = Othello || {};

//IIFE (Imediately Invocable Function Expression)
(function(){
    "use strict";
    Othello.Game = class Game{
        constructor(playerName, color){
            //init statistics
            this.round=0;
            this.hasWinner=false;

            //init new board
            this.board = new Board(); //TODO Board Class

            //init players
            this.players = [new Player('human', playerName, color), //TODO Player Class
                            new Player('pc', 'AI', this.otherColor(color))];


        }


    }
    //TODO: initialize dom elements: UI canvas/Background canvas/ Board canvas

    //TODO: Initialize Board object

    //TODO: Start Game loop



    //TODO: Make API members public
})();

