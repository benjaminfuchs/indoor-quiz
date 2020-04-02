/*jshint esversion: 6 */
/*jshint -W097 */
/*global require */
/*global console */
"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Entities = require("html-entities").AllHtmlEntities;
var entities = new Entities();
var port = 8900;
var sockets = [];

app.use(express.static("app"));

http.listen(port, function() {
  console.log("listening on *:" + port);
});

io.on("connection", function(socket) {
  var log = function(line) {
    console.log(line);
    for (let entry in sockets) {
      io.to(sockets[entry]).emit("outLog", line);
    }
  };

  log("ID " + socket.id + " connected");
  sockets.push(socket.id);

  /**
   * Handle city from client
   */
  socket.on("inImage", function(imagePosition) {
    log("ID " + socket.id + " image: " + imagePosition);
    for (let entry in sockets) {
      io.to(sockets[entry]).emit("outImage", imagePosition);
    }
  });

  /**
   * Handle guess from client
   */
  socket.on("inGuess", function(guess) {
    log("ID " + socket.id + " guess: " + guess.x + " " + guess.y);
    for (let entry in sockets) {
      io.to(sockets[entry]).emit("outGuess", socket.id, guess);
    }
  });

  /**
   * Handle state from client
   */
  socket.on("inState", function(state) {
    log("ID " + socket.id + " state: " + state);
    for (let entry in sockets) {
      io.to(sockets[entry]).emit("outState", socket.id, state);
    }
  });

  /**
   * Handle player from client
   */
  socket.on("inPlayer", function(player) {
    log("ID " + socket.id + " player: " + player);
    for (let entry in sockets) {
      io.to(sockets[entry]).emit("outPlayer", socket.id, player);
    }
  });
});

process.on('SIGTERM', shutDown);

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    process.exit(0);
}
