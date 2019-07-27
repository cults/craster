var cli = require('cli')
var package = require('./package.json')
var craster = require('./index')

cli.enable('status', 'version')
cli.setApp('craster', package.version)
cli.parse({
  url: ['u', 'URL of the 3D model', 'string', false],
  path: ['p', 'Captures path', 'path', 'tmp/craster'],
  image: ['i', 'Path to final image', 'path', false],
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

cli.main(function(args, options) {
  if (!options.server && !options.url) {
    var example = 'craster'
    example += " --url 'http://0.0.0.0:4000/example.stl'"
    example += ' --port 4000'
    example += ' --image tmp/craster.png'
    example += ' --debug'

    var message = "Please provide a URL. For example try:\n"
    message += "    " + example + "\n"
    message += "Or see the list of options with:\n"
    message += "    craster --help"

    cli.fatal(message)
  }

  craster.capture(
    options,
    cli.debug,
    cli.error,
    !options['no-progress'] && cli.progress
  )
})
