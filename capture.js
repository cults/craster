const args = require('system').args
const async = require('async')
const page = require('webpage').create()

function delay(duration, callback) {
  setTimeout(callback, duration)
}

function waitUntil(conditionCallback, done) {
  if (conditionCallback()) {
    done()
  } else {
    delay(10, function() {
      waitUntil(conditionCallback, done)
    })
  }
}

// Rotation by calling the 3D Viewer through the DOM
function rotateY(y) {
  window.viewer.rotate(0, y, 0)
  window.viewer.update()
}

function rotationsByIncrement(increment) {
  const results = []
  for (var i = 0; i < 360; i += increment) {
    results.push(i)
  }
  return results
}

function isLoadingComplete() {
  return page.evaluate(function() {
    return window._loadingComplete
  })
}

function integers(total) {
  const results = []
  for (var i = 0; i < total; i += 1) {
    results.push(i)
  }
  return results
}

function capture(url, tmpDir, total, width, height) {
  const increment = 360 / total
  const rotations = rotationsByIncrement(increment)

  function imagePath(num) {
    return tmpDir + '/craster-' + num + '.png'
  }

  function rotator(index, callback) {
    const rotation = index * increment
    console.log(index + '/' + total + ': Rotate to ' + rotation)
    page.evaluate(rotateY, increment)
    delay(20, function() {
      page.render(imagePath(index))
      callback()
    })
  }

  function done() {
    phantom.exit()
  }

  function start() {
    console.log('Starting captures in ' + tmpDir + '...')
    page.evaluate(rotateY, 0)
    async.eachSeries(integers(total), rotator, done)
  }

  page.viewportSize = { width: width, height: height }
  page.paperSize = { width: width, height: height }
  page.clipRect = { top: 0, left: 0, width: width, height: height }

  page.onConsoleMessage = function(msg) { console.log('console: ' + msg) }
  page.open(url, function() {
    console.log('Wait until loading complete...')
    waitUntil(isLoadingComplete, function() {
      delay(200, start)
    })
  })
}

if (args.length != 6) {
  console.log('Usage: phantomjs capture.js URL TMP_DIR TOTAL WIDTH HEIGHT')
  phantom.exit(1)
} else {
  const url = args[1]
  const tmpDir = args[2]
  const total = parseInt(args[3], 10)
  const width = parseInt(args[4], 10)
  const height = parseInt(args[5], 10)
  capture(url, tmpDir, total, width, height)
}
