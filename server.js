'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request')
var upload = require('./portfolio/portfolioUpload')
var CONST = require('./portfolio/constants')
var app = express();
var cronJob = require('cron').CronJob;
var PORT = process.env.PORT || 3003;


app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/marketWatch', require('./routes/portfolio'))
app.use('/minuteSnap', require('./routes/minuteSnap'))


function runAPICycle(){
  var minute = 0
  runCycle()
  function runCycle(){
    setTimeout(function(){
      request(`http://localhost:${PORT}/marketWatch/`,function(error, response, body){
        if(minute< 420){
          runCycle()
          minute++
        }
      })
    },60000)
  }
}

function updateEveryMinute(){
  console.log('boob');
  var minuteRecorder = 0;
  updateInOneMinute()
  function updateInOneMinute(){
    setTimeout(function(){
      request(`http://localhost:${PORT}/minuteSnap/record`,function(error, response, body){
        if(minuteRecorder < 3){
          updateInOneMinute()
          minuteRecorder++
         }
      })
    },60000)
  }
}



var runCycle = new cronJob('00 09 22 * * 1-5', function(){
  console.log('hello');
  runAPICycle()
});
runCycle.start();


var runMinuteRecordCycle = new cronJob('00 09 22 * * 1-5', function(){
  console.log('hello');
  request(`http://localhost:${PORT}/minuteSnap/clear`,function(error, response, body){
      updateEveryMinute()
    })
});
runMinuteRecordCycle.start();


upload.uploadPortfolio();
app.listen(PORT);
