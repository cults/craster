# Casper script that takes a capture and rotates the viewer
# Call it via the command line:
#
#     $ casperjs capture.coffee URL PATH.PNG TOTAL
#
casper = require("casper").create
  verbose: false
  logLevel: "debug"
  # waitTimeout: 15000
  # stepTimeout: 15000

if casper.cli.args.length < 2
  casper.echo "Usage: $ casperjs capture.coffee URL PATH.PNG TOTAL WIDTH HEIGHT"
  casper.exit 1

url = casper.cli.args[0]
path = casper.cli.args[1]
total = parseInt casper.cli.args[2]
width = parseInt casper.cli.args[3]
height = parseInt casper.cli.args[4]

increment = 360/total
rotations = (r for r in [0...360] by increment)

# Rotation by calling the 3D Viewer through the DOM
rotateY = (y) ->
  window.viewer.rotate(0, y, 0)
  window.viewer.update()

casper.echo "Capturing #{total} #{width}x#{height} pictures from #{url} in #{path}"
casper.start url

casper.each rotations, (casper, rotation, i) ->
  @then ->
    casper.echo "#{i}/#{total}: Rotate to #{rotation}"
    num = ("000" + rotation).slice(-3)
    new_path = path.replace('.png', '') + "-#{num}.png"
    @capture new_path, top: 0, left: 0, width: width, height: height

  @thenEvaluate(rotateY, increment)

casper.run()
