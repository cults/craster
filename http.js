// Express app that serves the HTML and JavaScript necessary for the 3D rendering

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')

// Setup app
const http = express()
http.engine('mustache', mustacheExpress())
http.set('view engine', 'mustache')
http.set('views', __dirname + '/views')

// Router
const router = express.Router()
router.get('/', function(req, res) {
  query = req.query
  res.render(
    'index.mustache',
    {
      url: query.url,
      color: query.color || 'eeeeee',
      width: query.width || 1000,
      height: query.height || 1000,
      x: query.x || 0,
      y: query.y || 0,
      z: query.z || 0,
    }
  )
})

// Mount engines
http.use(express.static(path.join(__dirname, 'public')))
http.use('/', router)

// Catch 404 and forward to error handler
http.use(function(req, res, next) {
  err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler that will print stacktrace
http.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', { message: err.message, error: err })
})

module.exports = http
