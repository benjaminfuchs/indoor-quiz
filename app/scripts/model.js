/*jshint esversion: 6 */

define(function () {
  "use strict";

  return class Model {
    constructor() {
      this.counter = null;
      this.imagePosition = 0;
      this.maxPlayers = 2;
      this.mode = null;
      this.players = new Map();
      this.first = null;
      this.state = null;

      this.images = [
        {
          fullName: "Kamin",
          position: {
            x: (642/1428),
            y: (1366/2108)
          },
          fileName: "../media/kamin.jpg"
        }];
    }

    reset() {
      this.resetCounter();
      this.first = null;
    }

    setMode(mode) {
      this.mode = mode;
    }

    getMode() {
      return this.mode;
    }

    getImage() {
      return this.images[this.imagePosition];
    }

    getNextImage() {
      this.imagePosition = this.imagePosition + 1;
      return this.imagePosition;
    }

    getImagePostion() {
      return this.imagePosition;
    }

    setImagePosition(imagePosition) {
      this.imagePosition = imagePosition;
    }

    isLastImage() {
      return this.imagePosition >= this.images.length - 1;
    }

    setNewPlayer(id, name) {
      let player = {
        "name": name,
        "num": (this.players.size + 1),
        "points": 0,
        "guess": null
      }
      this.players.set(id, player);
    }

    getPlayers() {
      return this.players;
    }

    getNumPlayers() {
      return this.players.size;
    }

    getMaxPlayers() {
      return this.maxPlayers;
    }

    getPlayerName(id) {
      return this.players.get(id).name;
    }

    isPlayer(id) {
      return this.players.has(id);
    }

    setFirst(id) {
      this.first = id;
    }

    getFirst() {
      return this.first;
    }

    getPlayerNum(id) {
      return this.players.get(id).num;
    }

    increasePoints(id) {
      let player = this.players.get(id);
      player.points += 1;
      this.players.set(id, player);
    }

    decreasePoints(id) {
      let player = this.players.get(id);
      player.points -= 1;
      this.players.set(id, player);
    }

    getPlayerPoints(id) {
      return this.players.get(id).points;
    }

    setGuess(id, guess) {
      let player = this.players.get(id);
      player.guess = guess;
      this.players.set(id, player);
    }

    getGuess(id) {
      return this.players.get(id).guess;
    }

    getCounter() {
      return this.counter;
    }

    resetCounter(counter) {
      this.counter = 20;
    }

    decrementCounter() {
      this.counter -= 1;
    }

    getState() {
      return this.state;
    }

    setState(state) {
      this.state = state;
    }
  };
});
