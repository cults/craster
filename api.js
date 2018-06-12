// Express app that can raster images on demand.

const express = require('express')
const craster = require('./index')

// Router

const router = express.Router()
router.get('/image', function(req, res) {
  const query = { ...req.query, image: __dirname + '/tmp/api-image.png' }

  craster.capture(
    query,
    console.log,
    console.error,
    function() {},
    function(path) {
      res.status(200)
      res.sendFile(path)
    }
  )
})

// Engines

const api = express()

api.use('/', router)

// Catch 404 and forward to error handler
api.use(function(req, res, next) {
  err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handle
api.use(function(err, req, res, next) {
  res
    .status(err.status || 500)
    .send(JSON.stringify({ message: err.message, error: err }))
})

module.exports = api
