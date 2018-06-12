var cli = require('cli')
var package = require('./package.json')
var craster = require('./index')
var api = require('./api')

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
  api: [false, 'Open the http API'],
})

cli.main(function(args, options) {
  if (!options.api && !options.url) {
    var exampleUrl = "'http://0.0.0.0:3000/example.stl'"
    var example = 'craster'
    example += ' --url ' + exampleUrl
    example += ' --port 3000'
    example += ' --image tmp/craster.png'
    example += ' --debug'
    cli.fatal("Please provide a URL. For example try:\n    " + example)
  }

  if (options.api) {
    var apiPort = 3100
    api.set('port', apiPort)
    api.listen(apiPort, function() {
      cli.debug('API open on ' + apiPort)
    })
  }

  if (options.url) {
    craster.capture(
      options,
      cli.debug,
      cli.error,
      !options['no-progress'] && cli.progress
    )
  }
})
