'use strict'


var Firebase    = require('firebase')
var marketRef   = new Firebase('https://rooftoptrading.firebaseio.com/market')
var marketArray = require('./marketArr')
var trackingHelpers = require('./trackingHelpers')
var YQL = require('yql')
var CONST = require('./constants')
var _ = require('lodash');


module.exports = {
  trackMarketStockInfo : function(index){
    var portfolioSymbolArray = new trackingHelpers.symbolArray(marketArray.marketArray);
    var query     = new YQL('select * from yahoo.finance.quotes where symbol in(' + portfolioSymbolArray + ')');
    query.exec(function(err, data){
      data.query.results.quote.map(function(quote, index, array){
        marketRef.child(quote.Symbol).child('currentEquityInfo').set(quote);
      })
    })
  },

  addMinuteSnapshot: function(){
    marketArray.marketArray.map(function(stock){
      var lastQuoteRef = marketRef.child(stock.Symbol).child('currentEquityInfo')
      lastQuoteRef.once('value', function(data){
        var obj = data.val()
        CONST.propertiesToRemove.map(function(prop){
          delete obj[prop]
        })
        marketRef.child(stock.Symbol).child('today').child(Date.now()).set(obj)
      })
    })
  },
  clearMinuteSnapshots: function(){
    marketArray.marketArray.map(function(stock){
      marketRef.child(stock.Symbol).child('today').remove()
    })
  }



}
