/*jshint esversion: 6 */

define([
  "jquery"
], function ($) {
  "use strict";

  return class View {
    constructor() {
      this.audio = new Audio();
    }

    // Set up the map and tiles
    init() {
      // HTML elements
      this.$black = $("#black");
      this.$buzzer = $("#buzzer");
      this.$buzzer = $("#buzzer");
      this.$controll = $("#controll");
      this.$counter = $("#counter");
      this.$dialog = $("#dialog");
      this.$game = $("#game");
      this.$grundriss = $("#grundriss");
      this.$header = $("#header");
      this.$image = $("#image");
      this.$intro = $("#intro");
      this.$nextButton = $("#nextButton");
      this.$playerName = $("#playerName");
      this.$status = $("#status");
      this.$dialog.show();
    }

    reset() {
      this.removeMarkers();
      this.$dialog.hide();
      this.audio.pause();
    }

    showPlayerView() {
      this.$buzzer.show();
      this.$game.show();
      this.reset();
    }

    showControllerView() {
      this.$controll.show();
      this.showConsoleLog();
      this.reset();
    }

    showConsoleLog() {
      // Display console log
      window.console = {
        log: function (line) {
          let $log = $("#log");
          $log.html($log.text() + "\n[client] " + line);
          $log.scrollTop($log[0].scrollHeight);
        }
      };
    }

    showPresenterView() {
      this.$header.show();
      this.$game.show();
      this.$buzzer.hide();
      this.reset();
    }

    showBlack() {
      this.$black.show();
    }

    showImage(image) {
      this.$image.attr("src", image);
    }

    showCircle(position) {
      let transPosition = this.transformPositionCircle(position);
      this.addMarker("markerCircle", transPosition.x, transPosition.y, "#FED10D", "fa fa-circle-o");
    }

    showMarker(num, position) {
      let transPosition = this.transformPositionMarker(position);
      if (num == 0) {
        this.addMarker("marker" + num, transPosition.x, transPosition.y, "#FED10D", "fa fa-map-marker");
      } else if (num == 1) {
        this.addMarker("marker" + num, transPosition.x, transPosition.y, "#DC143C", "fa fa-map-marker");
      } else {
        this.addMarker("marker" + num, transPosition.x, transPosition.y, "#00BFFF", "fa fa-map-marker");
      }
    }

    showCountdown(counter) {
      this.$status.removeAttr('style');
      this.$counter.html(counter);
    }

    showName(name) {
      this.$status.css("background-color", "rgba(255, 203, 59, 0.85)");
      this.$counter.html(name);
    }

    showPlayerName(num, name) {
      $("#namePlayer" + num).html(name);
    }

    addMarker(name, x, y, color, marker) {
      $("." + name).remove();
      $("body").append(
        $('<i class="marker ' + name + ' ' + marker + '" style="color: ' + color + '"></i>').css({
          "position": 'absolute',
          "z-index": 10000,
          "font-weight": 400,
          "font-size": "40px",
          "top": y + 'px',
          "left": x + 'px',
          "pointer-events": "none"
        })
      );
    }

    removeMarkers() {
      $(".fa-circle-o").remove();
      $(".marker").remove();
    }

    playIntro() {
      this.$intro.show();
      this.audio = new Audio('../media/intro.mp3');
      let video = document.getElementById("video");
      video.play();
      this.audio.play();
      let $video = $("#video");
      $video.on("pause ended", function () {
        $("#intro").hide();
      });
    }

    playCountdown() {
      this.audio = new Audio('../media/countdown.mp3');
      this.audio.play();
    }

    playHorn() {
      this.audio = new Audio('../media/horn.mp3');
      this.audio.play();
    }

    playSuperHorn() {
      this.audio = new Audio('../media/superhorn.mp3');
      this.audio.play();
    }

    stopAudio() {
      this.audio.pause();
    }

    setLog(line) {
      let $log = $("#log");
      $log.html($log.text() + "\n[server] " + line);
      $log.scrollTop($log[0].scrollHeight);
    }

    updatePoints(num, points) {
      if (num == 1) {
        $("#pointsPlayer" + num).html(points);
      } else {
        $("#pointsPlayer" + num).html(points);
      }
    }

    hideBlack() {
      this.$black.hide();
    }

    hideNext() {
      this.$nextButton.hide();
    }

    hideBuzzer() {
      this.$buzzer.hide();
    }

    getPlayerName() {
      return this.$playerName.val();
    }

    getPosition(e) {
      let rect = e.target.getBoundingClientRect();
      let x = (e.clientX - rect.left) / (rect.right - rect.left);
      let y = (e.clientY - rect.top) / (rect.bottom - rect.top);
      return {
        x,
        y
      }
    }

    transformPositionCircle(position) {
      let image1 = document.getElementById("grundriss");
      let rect = image1.getBoundingClientRect();
      let x = (position.x * (rect.right - rect.left)) + rect.left - 17.14 + window.scrollX;
      let y = (position.y * (rect.bottom - rect.top)) + rect.top - 23 + window.scrollY;
      return {
        x,
        y
      }
    }

    transformPositionMarker(position) {
      let image1 = document.getElementById("grundriss");
      let rect = image1.getBoundingClientRect();
      let x = (position.x * (rect.right - rect.left)) + rect.left - 11.42 + window.scrollX;
      let y = (position.y * (rect.bottom - rect.top)) + rect.top - 40 + window.scrollY;
      return {
        x,
        y
      }
    }
  };
});
