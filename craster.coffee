{spawn} = require('child_process')
cli = require('cli')
http = require('./http')
path = require('path')

cli.enable 'status', 'version'
cli.setApp 'craster', '1.5.1'
cli.parse
  url: ['u', 'URL of the 3D model', 'string', false]
  path: ['p', 'Captures path', 'path', 'tmp/craster']
  num: ['n', 'Number of captures', 'int', 20]
  x: [false, '3D X (Default is 0)', 'int', 0]
  y: [false, '3D Y for the start (Default is 0)', 'int', 0]
  z: [false, '3D Z (Default is 0)', 'int', 0]
  width: ['W', 'Image width', 'int', 1000]
  height: ['H', 'Image height', 'int', 1000]
  color: ['c', 'Color for the 3D model', 'string', 'eeeeee']
  'no-progress': ['s', 'Disable progress']
  port: [false, 'Port for the temporary http server that serves the viewer',
         'int', 0]
  'debug-wait': [false, 'Debug and keep http server open']

cli.main (args, options) ->
  unless options.url
    example = "'http://0.0.0.0:3000/example.stl'"
    cli.fatal "Please provide a URL. For example try `craster --url #{example} --port 3000`"

  http.set 'port', options.port
  server = http.listen options.port, ->
    host = server.address().address
    port = server.address().port
    cli.debug "HTTP server listening on #{host}:#{port}"

    url = "http://#{host}:#{port}/" + \
      "?url=#{encodeURIComponent options.url}" + \
      "&x=#{options.x}" + \
      "&y=#{options.y}" + \
      "&z=#{options.z}" + \
      "&width=#{options.width}" + \
      "&height=#{options.height}" + \
      "&color=#{options.color}"

    log = (str) ->
      if match = str.match(/^(\d+)\/\d+: /)
        unless options['no-progress']
          cli.progress (parseInt(match[1])+1) / options.num
      else
        cli.debug str

    args = [url,
            options.path,
            options.num,
            options.width,
            options.height]
    phantomjs args, log, (status) ->
      if status != 0
        cli.error "Command exited with a status of #{status}"
      else
        cli.debug "done"
      server.close() unless options['debug-wait']

phantomjs = (args, log, onExit) ->
  args.unshift path.join(__dirname, 'capture.js')
  args.unshift '--web-security=false'
  cli.debug "phantomjs #{args.join(' ')}"

  cmd = spawn("phantomjs", args ?= [])
  cmd.stdout.on 'data', (data) -> log data.toString().trim()
  cmd.stderr.on 'data', (data) -> console.error data.toString().trim()
  if onExit? then cmd.on 'exit', onExit
  cmd
