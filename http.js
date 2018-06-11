// Express app that serves the HTML and JavaScript necessary for the 3D rendering

const express = require('express')

// Setup app
const http = express()
http.set('views', __dirname + '/views')

// Router
const router = express.Router()
router.get('/image', function(req, res) {
  res.status(200).send(JSON.stringify({ ok: 200 }))
})

// Mount engines
http.use(express.static(__dirname + '/public'))
http.use('/', router)

// Catch 404 and forward to error handler
http.use(function(req, res, next) {
  err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handle
http.use(function(err, req, res, next) {
  res
    .status(err.status || 500)
    .send(JSON.stringify({ message: err.message, error: err }))
})

module.exports = http
