/*jshint esversion: 6 */

require.config({
  paths: {
    "io": [
      "../lib/socket"
    ],
    "jquery": [
      "../lib/jquery"
    ],
    "underscore": [
      "../lib/underscore"
    ],
    "sql": [
      "../lib/sql"
    ]
  },
  shim: {
    "jquery": {
      exports: "$"
    },
    "underscore": {
      exports: "_"
    },
    "leaflet": {
      exports: "L"
    },
    "leaflet-awesome-markers": {
      deps: ["leaflet"]
    }
  }
});

require(["jquery", "view", "model", "controller"], function($, View, Model, Controller) {
  "use strict";

  $(document).ready(function() {
    let view = new View();
    let model = new Model();
    let controller = new Controller(view, model);

    controller.init();
  });
});
