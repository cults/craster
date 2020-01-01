// Express app that serves the HTML and JavaScript for the 3D rendering.

const express = require('express')
const app = express()

// Serve static pages.
app.use(express.static(__dirname + '/public'))

// Serve local file by the given "?path=" parameter.
app.get('/file.stl', function (req, res) {
  res.sendFile(req.query.path)
})

module.exports = app
