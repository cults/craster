args = require('system').args
async = require('async')
page = require('webpage').create()

if args.length != 6
  console.log("Usage: phantomjs capture-phantom.coffee URL PATH TOTAL WIDTH" + \
              " HEIGHT")
  phantom.exit(1)
else
  url = args[1]
  path = args[2]
  total = parseInt args[3], 10
  width = parseInt args[4], 10
  height = parseInt args[5], 10

  increment = 360/total
  rotations = (i for i in [0...360] by increment)

  image_path = (rotation) ->
    num = ("000" + rotation).slice(-3)
    path.replace(".png", "") + "-#{num}.png"

  # Rotation by calling the 3D Viewer through the DOM
  rotateY = (y) ->
    window.viewer.rotate(0, y, 0)
    window.viewer.update()

  rotator = (i, callback) ->
    rotation = i * increment
    console.log("#{i}/#{total}: Rotate to #{rotation}")
    page.evaluate(rotateY, increment)
    window.setTimeout((->
      page.render(image_path(rotation))
      callback()
    ), 200)

  page.viewportSize = { width: width, height: height }
  page.paperSize = { width: width, height: height }
  page.clipRect = { top: 0, left: 0, width: width, height: height }
  page.onConsoleMessage = (msg) -> console.log("console: #{msg}")
  page.open url, ->
    page.evaluate(rotateY, 0)
    window.setTimeout((->
      async.eachSeries [0..total], rotator, ->
        phantom.exit()
    ), 3000)
