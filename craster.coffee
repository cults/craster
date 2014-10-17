{spawn} = require('child_process')
cli = require('cli')
http = require('./http')
path = require('path')

cli.enable 'status', 'version'
cli.setApp 'craster', '1.0.0'
cli.parse
  url: ['url', 'URL of the 3D model', 'URL', 'http://localhost:3222/example.stl']
  path: ['path', 'Captures path', 'PATH', 'tmp/screen']
  num: ['n', 'Number of captures', 'number', 20]
  x: ['x', '3D X (Default is 0)', 'number', 0]
  y: ['y', '3D Y for the start (Default is 0)', 'number', 0]
  z: ['z', '3D Z (Default is 0)', 'number', 0]
  port: ['port', 'Port for the temporary http server that serves the viewer', 'number', 3222]
  'no-progress': ['s', 'Disable progress']

cli.main (args, options) ->
  http.set 'port', options.port
  http.listen options.port, ->
    cli.debug 'HTTP server listening on port ' + options.port

    url = "http://localhost:#{options.port}/" + \
      "?url=#{encodeURIComponent options.url}" + \
      "&x=#{encodeURIComponent options.x}" + \
      "&y=#{encodeURIComponent options.y}" + \
      "&z=#{encodeURIComponent options.z}"

    log = (str) ->
      if match = str.match(/^(\d+)\/\d+: /)
        unless options['no-progress']
          cli.progress (parseInt(match[1])+1) / options.num
      else
        cli.debug str

    capture = path.join(__dirname, 'capture.coffee')
    casperjs [capture, url, options.path, options.num], log, (status) ->
      if status != 0
        cli.error "Casper exited with a status of #{status}"
      process.kill 'SIGHUP'

casperjs = (args, log, onExit) ->
    cmd = spawn("casperjs", args ?= [])
    cmd.stdout.on 'data', (data) -> log data.toString().trim()
    cmd.stderr.on 'data', (data) -> cli.error data.toString().trim()
    if onExit? then cmd.on 'exit', onExit
    cmd
