var spawn = require('child_process').spawn
var cli = require('cli')
var http = require('./http')
var path = require('path')
var package = require('./package.json')

cli.enable('status', 'version')
cli.setApp('craster', package.version)
cli.parse({
  url: ['u', 'URL of the 3D model', 'string', false],
  path: ['p', 'Captures path', 'path', 'tmp/craster'],
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
    var exampleUrl = "'http://0.0.0.0:3000/example.stl'"
    var example = 'craster --url ' + exampleUrl + ' --port 3000'
    cli.fatal("Please provide a URL. For example try:\n    " + example)
  }

  http.set('port', options.port)
  var server = http.listen(options.port, function() {
    var host = '0.0.0.0'
    var port = server.address().port
    cli.debug('HTTP server listening on ' + host + ':' + port)

    if (options.url) {
      var url = 'http://' + host + ':' + port + '/'
      url += '?url=' + encodeURIComponent(options.url)
      url += '&x=' + options.x
      url += '&y=' + options.y
      url += '&z=' + options.z
      url += '&width=' + options.width
      url += '&height=' + options.height
      url += '&color=' + options.color

      function log(str) {
        var match = str.match(/^(\d+)\/\d+: /)
        if (match) {
          if (!options['no-progress']) {
            cli.progress((parseInt(match[1])+1) / options.num)
          }
        } else {
          cli.debug(str)
        }
      }

      var args = [
        url,
        options.path,
        options.num,
        options.width,
        options.height,
      ]

      phantomjs(args, log, function(status) {
        if (status != 0) {
          cli.error('Command exited with a status of ' + status)
        } else {
          cli.debug('done')
        }
        if (!options['server']) server.close()
      })
    }
  })
})

function phantomjs(args, log, onExit) {
  args.unshift(path.join(__dirname, 'capture.js'))
  args.unshift('--web-security=false')
  var command = 'node_modules/.bin/phantomjs'

  cli.debug(command + ' ' + args.join(' '))

  var cmd = spawn(command, args)
  cmd.stdout.on('data', function(data) {
    log(data.toString().trim())
  })
  cmd.stderr.on('data', function(data) {
    console.error(data.toString().trim())
  })
  cmd.on('exit', onExit)
}
