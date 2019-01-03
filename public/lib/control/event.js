/* jshint esversion: 6 */

/**
 * Event Listeners and notifications module
 */
// sender is the context of the Model or View which originates the event
export default class OthelloEvent {
    constructor(sender) {
        this._sender = sender;
        /** @type {any[] | ((arg0: any, arg1: undefined) => void)[]} */
        this._listeners = [];
    }
    /**
     * @param {any} listener
     */
    attach(listener) { // add listener closures to the list
        this._listeners.push(listener);
    }
    /**
     * @param {undefined} [args]
     */
    notify(args) { // loop through, calling attached listeners
        this._listeners.forEach(
            (v, i) => {
                console.log('v:\n', v);
                console.log('i:\n', i);
                this._listeners[i](this._sender, args);
            }
        );
    }
}