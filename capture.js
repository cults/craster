// Generated by CoffeeScript 1.11.1
(function() {
  var args, async, capture, delay, height, page, path, total, url, waitUntil, width;

  args = require('system').args;

  async = require('async');

  page = require('webpage').create();

  delay = function(duration, callback) {
    return setTimeout(callback, duration);
  };

  waitUntil = function(callback, conditionCallback) {
    if (callback()) {
      return conditionCallback();
    } else {
      return delay(10, function() {
        return waitUntil(callback, conditionCallback);
      });
    }
  };

  capture = function(url, path, total, width, height) {
    var i, image_path, increment, isLoadingComplete, rotateY, rotations, rotator, start;
    increment = 360 / total;
    rotations = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = increment; j < 360; i = j += ref) {
        results.push(i);
      }
      return results;
    })();
    image_path = function(rotation) {
      var num;
      num = ("000" + rotation).slice(-3);
      return path.replace(".png", "") + ("-" + num + ".png");
    };
    rotateY = function(y) {
      window.viewer.rotate(0, y, 0);
      return window.viewer.update();
    };
    isLoadingComplete = function() {
      return page.evaluate(function() {
        return window._loadingComplete;
      });
    };
    rotator = function(i, callback) {
      var rotation;
      rotation = i * increment;
      console.log(i + "/" + total + ": Rotate to " + rotation);
      page.evaluate(rotateY, increment);
      return delay(10, function() {
        page.render(image_path(rotation));
        return callback();
      });
    };
    start = function() {
      var j, results;
      console.log("Starting captures...");
      page.evaluate(rotateY, 0);
      return async.eachSeries((function() {
        results = [];
        for (var j = 0; 0 <= total ? j <= total : j >= total; 0 <= total ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this), rotator, function() {
        return phantom.exit();
      });
    };
    page.viewportSize = {
      width: width,
      height: height
    };
    page.paperSize = {
      width: width,
      height: height
    };
    page.clipRect = {
      top: 0,
      left: 0,
      width: width,
      height: height
    };
    page.onConsoleMessage = function(msg) {
      return console.log("console: " + msg);
    };
    return page.open(url, function() {
      console.log("Wait until loading complete...");
      return waitUntil(isLoadingComplete, start);
    });
  };

  if (args.length !== 6) {
    console.log("Usage: phantomjs capture.js URL PATH TOTAL WIDTH HEIGHT");
    phantom.exit(1);
  } else {
    url = args[1];
    path = args[2];
    total = parseInt(args[3], 10);
    width = parseInt(args[4], 10);
    height = parseInt(args[5], 10);
    capture(url, path, total, width, height);
  }

}).call(this);
