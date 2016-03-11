# Express app that serves the HTML and JavaScript necessary for the 3D rendering
express = require('express')
path = require('path')
bodyParser = require('body-parser')
assets = require('connect-assets')
jade = require('jade')

# Setup app
http = express()
http.engine 'jade', jade.__express
http.set 'views', path.join(__dirname, 'views')

# Router
router = express.Router()
router.get '/', (req, res) ->
  res.render 'index.jade',
    url: req.query.url
    width: req.query.width || 1000
    height: req.query.height || 1000
    x: req.query.x || 0
    y: req.query.y || 0
    z: req.query.z || 0

# Mount engines
http.use assets(paths: [path.join(__dirname, 'assets', 'js')])
http.use express.static(path.join(__dirname, 'public'))
http.use '/', router

# catch 404 and forward to error handler
http.use (req, res, next) ->
  err = new Error('Not Found')
  err.status = 404
  next(err)

# development error handler that will print stacktrace
http.use (err, req, res, next) ->
  res.status(err.status || 500)
  res.render 'error', message: err.message, error: err

module.exports = http
