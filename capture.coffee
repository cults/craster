casper = require("casper").create
  verbose: true,
  logLevel: "debug",
  waitTimeout: 15000,
  stepTimeout: 15000,
  pageSettings: {
    webSecurityEnabled: false
    ignoreSslErrors: true
  }

if casper.cli.args.length < 2
  casper.echo("Usage: $ casperjs capture.coffee URL PATH.PNG").exit(1)

url = casper.cli.args[0]
path = casper.cli.args[1]
total = 20
increment = 360/total

rotations = (r for r in [0...360] by increment)

# Rotation by calling the 3D Viewer
rotateY = (y) ->
  window.viewer.rotate(0, y, 0)
  window.viewer.update()

casper.start url

casper.each rotations, (casper, rotation, i) ->
  @then ->
    @echo("#{i}/#{total}) Rotate to #{rotation}", 'INFO')

  @then ->
    num = ("000" + rotation).slice(-3)
    new_path = path.replace('.png', "-#{num}.png")
    @capture new_path, top: 0, left: 0, width: 480, height: 480

  @thenEvaluate(rotateY, increment)

casper.run()

# http://www.lcdf.org/gifsicle/man.html
# for f in tmp/previews/*/*/*.png; do convert $f $f.gif; done
# for dir in tmp/previews/*/*; do gifsicle -l --colors=100 $dir/*.png.gif > $dir/final.gif; done
