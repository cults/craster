var cli = require('cli')
var path = require('path')
const fs = require('fs')

var package = require('./package.json')
var craster = require('./index')

cli.enable('status', 'version')
cli.setApp('craster', package.version)
cli.parse({
  url: ['u', 'URL of the 3D model', 'string', null],
  path: [false, 'Path of the 3D model', 'string', null],
  image: ['i', 'Path to final image', 'path', null],
  num: ['n', 'Number of captures', 'int', 20],
  x: [false, '3D X (Default is 0)', 'int', 0],
  y: [false, '3D Y for the start (Default is 0)', 'int', 0],
  z: [false, '3D Z (Default is 0)', 'int', 0],
  width: ['W', 'Image width', 'int', 1000],
  height: ['H', 'Image height', 'int', 1000],
  color: ['c', 'Color for the 3D model', 'string', 'eeeeee'],
  'no-progress': ['s', 'Disable progress'],
  port: [
    false,
    'Port for the http server that serves the viewer',
    'int',
    0,
  ],
  server: [false, 'Keep the http server open'],
})

cli.main(function (args, options) {
  if (!options.server && ((!options.url && !options.path) || !options.image)) {
    var example = 'craster'
    example += " --url http://wtf.sunfox.org/3d/cults-logo.stl"
    example += ' --image logo.png'
    example += ' --debug'

    var message = "Please provide a URL or a path and the final image name. "
    message += "For example try:\n"
    message += "    " + example + "\n"
    message += "Or see the list of options with:\n"
    message += "    craster --help"

    cli.fatal(message)
  }

  if (options.path) {
    if (!fs.existsSync(options.path)) cli.fatal("No such file: " + options.path)
    options.path = path.resolve(options.path)
  }

  craster.capture(
    options,
    cli.debug,
    cli.error,
    !options['no-progress'] && cli.progress
  )
})
