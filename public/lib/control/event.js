/* jshint esversion: 6 */

/**
 * Event Listeners and notifications module
 */
export default class OthelloEvent {
    /**
     * 
     * @param {*} sender sender is the context of the Model or View which originates the event
     */
    constructor(sender) {
        this._sender = sender;
        /** @type {any[] | ((arg0: any, arg1: undefined) => void)[]} */
        this._listeners = [];
    }
    /**
     * add listener closures to the list
     * @param {any} listener
     */
    attach(listener) {
        this._listeners.push(listener);
    }
    /**
     * loop through, calling attached listeners
     * @param {any} [args]
     */
    notify(args) {
        this._listeners.forEach(
            (v, i) => {
                this._listeners[i](this._sender, args);
            }
        );
    }
}