var spawn = require('child_process').spawn
var http = require('./http')
var mergeImg = require('merge-img')
var fs = require('fs')
var async = require('async')

function capture(options, debug, error, progress = null) {
  http.set('port', options.port)
  var server = http.listen(options.port, function() {
    var host = '0.0.0.0'
    var port = server.address().port

    debug('HTTP server listening on ' + host + ':' + port)

    if (options.url) {
      var url = 'http://' + host + ':' + port + '/'
      url += '?url=' + encodeURIComponent(options.url)
      url += '&x=' + options.x
      url += '&y=' + options.y
      url += '&z=' + options.z
      url += '&width=' + options.width
      url += '&height=' + options.height
      url += '&color=' + options.color

      function phantomLog(str) {
        var match = str.match(/^(\d+)\/\d+: /)
        if (match) {
          if (progress) {
            progress((parseInt(match[1]) + 1) / options.num)
          }
        } else {
          debug(str)
        }
      }

      var args = [
        url,
        options.path,
        options.num,
        options.width,
        options.height,
      ]

      phantomjs(args, phantomLog, debug, error, function(status) {
        if (status != 0) {
          error('Command exited with a status of ' + status)
        } else {
          debug('Captures done')
        }

        if (!options.server) server.close()

        if (options.image) {
          mergeImages(options.num, options.image, debug)
        }
      })
    }
  })
}

function phantomjs(args, log, debug, error, onExit) {
  args.unshift(__dirname + '/capture.js')
  args.unshift('--web-security=false')
  var command = 'node_modules/.bin/phantomjs'

  debug(command + ' ' + args.join(' '))

  var cmd = spawn(command, args)
  cmd.stdout.on('data', function(data) {
    log(data.toString().trim())
  })
  cmd.stderr.on('data', function(data) {
    error(data.toString().trim())
  })
  cmd.on('exit', onExit)
}

function mergeImages(num, path, debug) {
  debug('Merging captures to ' + path)

  var imagePaths = Array.apply(null, Array(num)).map(function (_, i) {
    return 'tmp/craster-' + i + '.png'
  })

  mergeImg(imagePaths, { direction: true }).then(function(img) {
    img.write(path, function() {
      debug('Merge done')

      async.concat(imagePaths, fs.unlink, function(err, files) {
        debug('Deleted temporary captures')
      })
    })
  })
}

module.exports.capture = capture
