/* jshint esversion: 6 */
import OthelloControler from "./lib/control/gamecontroler.js";
import fbapp from "./lib/firbasehost.js";


(function () {
  fbapp();

  /// initialize othello
  const othControler = new OthelloControler();

}());