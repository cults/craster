# Express app that serves the HTML and JavaScript necessary for the 3D rendering
express = require('express')
path = require('path')
bodyParser = require('body-parser')
assets = require('connect-assets')
pug = require('pug')

# Setup app
http = express()
http.engine 'pug', pug.__express
http.set 'views', path.join(__dirname, 'views')
http.set 'view engine', 'pug'

# Router
router = express.Router()
router.get '/', (req, res) ->
  query = req.query
  res.render 'index.pug',
    url: query.url
    color: query.color || 'eeeeee'
    width: query.width || 1000
    height: query.height || 1000
    x: query.x || 0
    y: query.y || 0
    z: query.z || 0

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
