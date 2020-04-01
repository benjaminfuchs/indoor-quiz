/*jshint esversion: 6 */

define(["io", "underscore", "client"], function (io, _, Client) {
  "use strict";

  return class Controller {
    constructor(view, model) {
      this.client = new Client(this);
      this.model = model;
      this.timer = null;
      this.view = view;
    }

    init() {
      // Register events
      $("#blackButton").click(_.bind(this.black, this));
      $("#quizmasterButton").click(_.bind(this.quizmaster, this));
      $("#introButton").click(_.bind(this.intro, this));
      $("#joinButton").click(_.bind(this.player, this));
      $("#buzzerButton").click(_.bind(this.stop, this));
      $("#nextButton").click(_.bind(this.next, this));
      $("#playButton").click(_.bind(this.play, this));
      $("#presenterButton").click(_.bind(this.presenter, this));
      $("#refreshButton").click(_.bind(this.refresh, this));
      $("#showButton").click(_.bind(this.show, this));
      $("#superhornButton").click(_.bind(this.superhorn, this));

      this.view.init();
    }

    reset() {
      clearInterval(this.timer);
      this.view.reset();
      this.model.reset();
    }

    /**
     *  Handle server events
     */
    setConnected() {
      console.log("connected to server");
    }

    setDisconnected() {
      console.log("disconnect from server");
    }

    setLog(line) {
      this.view.setLog(line);
    }

    newPlayer(id, name) {
      console.log("player joined: " + name);
      if (this.model.getNumPlayers() >= this.model.getMaxPlayers()) {
        return
      }
      this.model.setNewPlayer(id, name);
      this.view.showPlayerName(this.model.getPlayerNum(id), this.model.getPlayerName(id));
    }

    setImage(imagePosition) {
      console.log("current image: " + imagePosition);
      this.model.setImagePosition(imagePosition);
    }

    setGuess(id, guess) {
      if (this.model.getMode() == "presenter") {
        console.log("guess from " + this.model.getPlayerName(id) + ": " + guess.x + " " + + guess.y);
        this.model.setGuess(id, guess);
        this.view.showMarker(this.model.getPlayerNum(id), this.model.getGuess(id));
      }
    }

    setState(id, state) {
      console.log("state: " + state);
      if (state == "black") {
        this.stateBlack();
      } else if (state == "intro") {
        this.stateIntro();
      } else if (state == "start") {
        this.stateStart();
      } else if (state == "superhorn") {
        this.stateSuperhorn();
      } else if (state == "stop") {
        this.stateStop(id);
      } else if (state == "refresh") {
        window.location.reload(true);
      } else if (state == "show") {
        this.stateShow();
      }
      this.model.setState(state);
    }

    stateBlack() {
      if (this.model.getMode() != "quizmaster") {
        this.view.showBlack();
      }
      this.reset();
    }

    stateIntro() {
      if (this.model.getMode() == "presenter") {
        this.view.playIntro();
      }
      this.view.hideBlack();
    }

    stateStart() {
      if (this.model.getNumPlayers() < this.model.getMaxPlayers()) {
        console.log("Waiting for players.");
        return;
      }

      this.reset();
      this.view.showImage(this.model.getImage().fileName);
      this.view.showCountdown(this.model.getCounter());
      this.model.decrementCounter();
      this.view.hideBlack();

      var that = this;
      clearInterval(this.timer);
      this.timer = setInterval(function () {
        if (that.model.getMode() == "presenter") {
          if (that.model.getCounter() <= 0) {
            that.client.sendState("stop");
          }
        }

        if (that.model.getMode() == "presenter") {
          if (that.model.getCounter() == 5) {
            that.view.playCountdown();
          }
        }

        that.view.showImage(that.model.getImage().fileName);
        that.view.showCountdown(that.model.getCounter());
        that.model.decrementCounter();
      }, 1000);

    }

    stateStop(id) {
      clearInterval(this.timer);
      this.view.stopAudio();
      if (this.model.isPlayer(id)) {
        this.model.setFirst(id);
        this.view.showName(this.model.getPlayerName(id));
      } else {
        this.view.showName("Vorbei");
      }
      if (this.model.getMode() == "presenter") {
        this.view.playHorn();
      }
    }

    stateShow() {
      if (this.model.getMode() == "presenter") {
        this.view.showCircle(this.model.getImage().position);
        this.calculatePoints();
        clearInterval(this.timer);
        this.view.stopAudio();
      }
      this.view.showImage(this.model.getImage().fileName);
    }

    stateSuperhorn() {
      if (this.model.getMode() == "presenter") {
        this.view.playSuperHorn();
      }
    }

    /**
     *  Handle user input
     */
    presenter() {
      this.view.showPresenterView();
      this.model.setMode("presenter");
    }

    quizmaster() {
      this.view.showControllerView();
      this.model.setMode("quizmaster");
    }

    player() {
      this.client.sendPlayer(this.view.getPlayerName());
      this.view.showPlayerView();
      this.model.setMode("player");
      this.view.$grundriss.on("click", _.bind(this.userClick, this));
    }

    userClick(e) {
      console.log("event: userClick");
      let position = this.view.getPosition(e)
      if (this.model.getState() == "start") {
        this.view.showMarker(0, position);
        this.client.sendGuess(position);
      }
    }

    black() {
      console.log("event: black");
      this.client.sendState("black");
    }

    intro() {
      console.log("event: intro");
      this.client.sendState("intro");
    }

    play() {
      console.log("event: start");
      this.client.sendImage(this.model.getImagePostion());
      this.client.sendState("start");
    }

    show() {
      console.log("event: show");
      this.client.sendState("show");
    }

    next() {
      console.log("event: next");
      this.client.sendImage(this.model.getNextImage());
      this.client.sendState("start");
      if (this.model.isLastImage()) {
        this.view.hideNext();
      }
    }

    refresh() {
      console.log("event: refresh");
      this.client.sendState("refresh");
    }

    superhorn() {
      console.log("event: superhorn");
      this.client.sendState("superhorn");
    }

    stop() {
      console.log("event: stop");
      if (this.model.getState() == "start") {
        this.client.sendState("stop");
      }
    }

    /**
     *  Helper
     */
    calculatePoints() {
      let id = this.model.getFirst();
      this.model.setFirst(null);
      if (id) {
        let guess = this.model.getGuess(id);
        if (this.isGuessCorrect(guess, this.model.getImage().position)) {
          this.model.increasePoints(id);
          this.view.updatePoints(this.model.getPlayerNum(id), this.model.getPlayerPoints(id));
        } else {
          this.model.decreasePoints(id);
          this.view.updatePoints(this.model.getPlayerNum(id), this.model.getPlayerPoints(id))
        }
      }
    }

    isGuessCorrect(guess, position) {
      let a = guess.x - position.x;
      let b = guess.y - position.y;
      let c = Math.sqrt(a * a + b * b);
      return c <= 0.032;
    }
  };
});
