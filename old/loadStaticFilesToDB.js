// only run once.

const axios = require('axios')

var starterFilesNeeders= require('./starterFilesNeeders.json');
var myAddRouteNeeders="http://localhost:3111/api/v1/NeedersLookingForMatch"
starterFilesNeeders.forEach((x)=>{
  console.log(x)
  axios.post(myAddRouteNeeders, x)
  .then(response=>console.log("RESPONSE", response))
  .catch(err=>console.log("ERROR", err))
})


var starterFilesCaretakers= require('./starterFilesCareTakers.json');
var myAddRouteCaretakers="http://localhost:3111/api/v1/CaretakersLookingForMatch"
starterFilesCaretakers.forEach((x)=>{
  console.log(x)
  axios.post(myAddRouteCaretakers, x)
  .then(response=>console.log("RESPONSE", response))
  .catch(err=>console.log("ERROR", err))
})
