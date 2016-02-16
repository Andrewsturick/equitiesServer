var express = require('express')
var router = express.Router();

var tracker = require('../portfolio/tracker1.js')

router.get('/', function(req, res){
  tracker.trackMarketStockInfo()
  res.send("done")
})

module.exports = router;
