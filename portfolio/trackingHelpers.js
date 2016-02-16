module.exports = {
  symbolArray : function(arr){
    var portfolioSymbolArray =[];
    arr.map(function(obj){
       portfolioSymbolArray.push( '"'  + obj.Symbol + '"')
    })
    return  portfolioSymbolArray
  }
}
