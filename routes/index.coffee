express = require('express')
router = express.Router()

router.get '/', (req, res) ->
  res.render 'index',
    url: req.param('url'),
    x: req.param('x'),
    y: req.param('y'),
    z: req.param('z')

module.exports = router
