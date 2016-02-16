var express = require('express')
var router = express.Router();

var position = require('../portfolio/portfolioUpload.js')
var tracker = require('../portfolio/tracker1.js')

router.get('/record', function(req, res){
  // tracker.trackPortfolio()
  tracker.addMinuteSnapshot()
  res.send("done")
})
router.get('/clear', function(req, res){
  // tracker.trackPortfolio()
  console.log('cloear');
  tracker.clearMinuteSnapshots()
  res.send("done")
})

module.exports = router;