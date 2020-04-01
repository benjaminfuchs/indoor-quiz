/*jshint esversion: 6 */

define(["io"], function(io, _) {
  "use strict";

  return class Client {
    constructor(controller) {
      this.socket = io();

      /**
       *  Successfully connected to server event
       */
      this.socket.on("connect", function() {
        controller.setConnected();
      });

      /**
       *  Disconnected from server event
       */
      this.socket.on("disconnect", function() {
        controller.setDisconnected();
      });

      /**
       *  Receive new image position from server
       */
      this.socket.on("outImage", function(imagePosition) {
        controller.setImage(imagePosition);
      });

      /**
       * Receive new guess from server
       */
      this.socket.on("outGuess", function(id, guess) {
        controller.setGuess(id, guess);
      });

      /**
       *  Receive state from server
       */
      this.socket.on("outState", function(id, state) {
        controller.setState(id, state);
      });

      /**
       *  Receive log from server
       */
      this.socket.on("outLog", function(line) {
        controller.setLog(line);
      });

      /**
       *  Receive player from server
       */
      this.socket.on("outPlayer", function(id, name) {
        controller.newPlayer(id, name);
      });
    }

    /**
     *  Send new image position to server
     */
    sendImage(imagePosition) {
      this.socket.emit("inImage", imagePosition);
    }

    /**
     *  Send new guess to server
     */
    sendGuess(guess) {
      this.socket.emit("inGuess", guess);
    }

    /**
     *  Send new state to server
     */
    sendState(state) {
      this.socket.emit("inState", state);
    }

    /**
     *  Send player from server
     */
    sendPlayer(name) {
      this.socket.emit("inPlayer", name);
    }
  };
});
