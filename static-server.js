// Express app that serves the HTML and JavaScript for the 3D rendering.

const express = require('express')
const staticServer = express()

staticServer.use(express.static(__dirname + '/public'))

module.exports = staticServer
