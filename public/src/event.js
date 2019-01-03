/* jshint esversion: 6 */

/**
 * Event Listeners and notifications module
 */
var othelloMVC = (function othelloMVC(othello) {
    'use strict';
    // sender is the context of the Model or View which originates the event
    class OthelloEvent {
        constructor(sender) {
            this._sender = sender;
            this._listeners = [];
        }
        attach(listener) { // add listener closures to the list
            this._listeners.push(listener);
        }
        notify(args) { // loop through, calling attached listeners
            this._listeners.forEach(
                (v,i) => {
                    console.log('v:\n', v);
                    console.log('i:\n', i);
                    this._listeners[i](this._sender, args);}
            );
        }
    }

    //API
    othello.Event = OthelloEvent;

    return othello;
})(othelloMVC || {});