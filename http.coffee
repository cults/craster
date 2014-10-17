# Express app that serves the HTML and JavaScript necessary for the 3D rendering
express = require('express')
path = require('path')
bodyParser = require('body-parser')
assets = require('connect-assets')

# Setup app
http = express()
http.set 'views', path.join(__dirname, 'views')
http.set 'view engine', 'jade'

# Router
router = express.Router()
router.get '/', (req, res) ->
  res.render 'index',
    url: req.param('url')
    width: req.param('width')
    height: req.param('height')
    x: req.param('x')
    y: req.param('y')
    z: req.param('z')

# Mount engines
http.use bodyParser.urlencoded(extended: false)
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
