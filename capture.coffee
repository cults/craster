args = require('system').args
async = require('async')
page = require('webpage').create()

delay = (duration, callback) ->
  setTimeout(callback, duration)

waitUntil = (callback, conditionCallback) ->
  if callback()
    conditionCallback()
  else
    delay 10, ->
      waitUntil(callback, conditionCallback)

capture = (url, path, total, width, height) ->
  increment = 360/total
  rotations = (i for i in [0...360] by increment)

  image_path = (rotation) ->
    num = ("000" + rotation).slice(-3)
    path.replace(".png", "") + "-#{num}.png"

  # Rotation by calling the 3D Viewer through the DOM
  rotateY = (y) ->
    window.viewer.rotate(0, y, 0)
    window.viewer.update()

  isLoadingComplete = ->
    page.evaluate -> window._loadingComplete

  rotator = (i, callback) ->
    rotation = i * increment
    console.log("#{i}/#{total}: Rotate to #{rotation}")
    page.evaluate(rotateY, increment)
    delay 200, ->
      page.render(image_path(rotation))
      callback()

  start = ->
    console.log("Starting captures...")
    page.evaluate(rotateY, 0)
    async.eachSeries [0..total], rotator, ->
      phantom.exit()

  page.viewportSize = { width: width, height: height }
  page.paperSize = { width: width, height: height }
  page.clipRect = { top: 0, left: 0, width: width, height: height }
  page.onConsoleMessage = (msg) -> console.log("console: #{msg}")
  page.open url, ->
    console.log("Wait until loading complete...")
    waitUntil(isLoadingComplete, start)

if args.length != 6
  console.log("Usage: phantomjs capture.js URL PATH TOTAL WIDTH HEIGHT")
  phantom.exit(1)
else
  url = args[1]
  path = args[2]
  total = parseInt args[3], 10
  width = parseInt args[4], 10
  height = parseInt args[5], 10
  capture(url, path, total, width, height)
