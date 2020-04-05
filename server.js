const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const restify = require("express-restify-mongoose");
const app = express();
const router = express.Router();
const cors = require("cors");
const Storage = require("@google-cloud/storage");
// const Multer = require('multer')
const axios = require("axios");

app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// When successfully connected
mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open!");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error!");
});

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);
var Schema = mongoose.Schema;

// Define models
//
// V0001 Schema - to be built by Hocho in restify.
// NeedersLookingForMatch
// Email
// Name
// ZipCode (we know this is USA specific, this is just for v1mockups)
// Description
// Custom1
// Custom2
// Hashtags. Example "#VETERAN, #LGBT, #PREGNANT"
//
var NeedersLookingForMatch = mongoose.model(
  "NeedersLookingForMatch",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    email: String,
    name: String,
    ZipCode: String,  //TODO ZZZZ: Full geo would have
                    ///  Country, StateOrRegion, ZipOrPostalCodeEquivalent
                    ///  very rural, rural, semi-rural, semi-urban, urban, very urban
                    ///  Street Address they typed in (not checked)
                    ///  LatLong
                    ///  Don't store as a string. Store as separate fields.
    Description: String, // This is the need description //TODO ZZZZ: change this to NeedsDescription, an array
    AdditionalInfo: String, // longer information, like a narrative of what happened, context.
                           // They can also provide a facebook/IG/ link.
    Custom1: String,
    Custom2: String,
    Hashtags: String, // separated by spaces
    RequestedClusterSize: Number, //if empty, assume 3. A hospital might make a request for 45 helpers for something
  })
);


// Hashtags. Example "#VETERAN, #LGBT, #PREGNANT"
var CaretakersLookingForMatch = mongoose.model(
  "CaretakersLookingForMatch",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    email: String,
    name: String,
    ZipCode: String,
    Description: String, //TODO ZZZZ: change this to CareDescription, an array
    AdditionalInfo: String,
    Custom1: String,
    Custom2: String,
    Hashtags: String, // Hashtags. Example "#VETERAN, #LGBT, #PREGNANT"
    SlotCount: Number, // 6 means they'd be happy to be matched into 6 clusters. I.e. they are bored/helpful
  })
);

// MatchedClusters



var MatchedClusters = mongoose.model(
  "MatchedClusters",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    ClusterIsActive: Boolean,
    NeederEmail: String,
    ZipCodeCommon: String,
    HashtagsCommon: String, // HashtagsCommon. Example "#VETERAN, #LGBT, #PREGNANT"
    NeederPrimaryNeed: String,
    Caretaker1Email: String,
    Caretaker2Email: String,
    Caretaker3Email: String,
    Caretaker4Email: String,
    Caretaker5Email: String,
    Caretaker6Email: String,
    Caretaker7Email: String,
    Caretaker8Email: String,
    Caretaker9Email: String,
    Caretaker10Email: String,
    ExtraJSONstrings: String, // This is a JSONstringify of an object with the 1Needer+3Caretakers.
    // No standard is set on this. Carefully check the object to see if it conforms
    // to what you expect. I suggest storing a "typekey" in the object so you
    // can tell your call to the v001 database API works.
    MatchCustom101: String,
    MatchCustom102: String,
  })
);

var TwilioBlob = mongoose.model(
  "TwilioBlob",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    TwilioJSONBlob: String, // This is a JSONstringify of whatever Twilio gives us.
    Custom701: String,
    Custom702: String,
  })
);

app.get('versionName', function(req, res, next) {
  res.send("ToddlerAPI 4_5_2020, simple authentication is on.")
});

// Authorization via a simple key.
app.use(function(req, res, next) {
  var str = req.get('Authorization');
  console.log(Date().toString());
  if (str==="3CAREGIVERS") {
    console.log("Authorization GOOD!");
    next();
  } else {
    console.log("Authorization incorrect or missing");
    res.status(401);
    res.send("Authorization incorrect or missing");
  }
});

app.use(function(req, res, next) {
  console.log(req.get('Authorization'));
  next();
});

restify.serve(router, NeedersLookingForMatch);
restify.serve(router, TwilioBlob);
restify.serve(router, CaretakersLookingForMatch);
restify.serve(router, MatchedClusters);

app.use(router);
//
// app.get('/getOneSpecialCardThenEraseWithFallback', function(req, res) {
//   Image.find({categories: "special"}).count().exec(function(err,count) {
//     console.log("SPECIAL COUNT", count)
//     if (count>0) {
//       var random=Math.floor(Math.random()*count);
//       Image.findOneAndRemove({categories: "special"})
//       .exec(function(err, imageRecord) {
//         if (err) {
//           res.json(err)
//         } else {
//           res.json(imageRecord)
//         }
//       })
//     } else {
//       getOneImageRecordPromise()
//       .then((imageRec)=>{res.json(imageRec)})
//     }
//   })
// })
//
// app.get('/removeSpecialCards', function(req,res) {
//   Image.deleteMany({categories: "special"}).exec(
//     function (err, imageRecords) {
//       if(err) {
//         res.json(err)
//       } else {
//         res.json(imageRecords)
//       }
//     }
//   )
// })
//
// app.get('/getOneRandomCard', function(req,res) {
//   Image.count().exec(function(err,count) {
//     var random=Math.floor(Math.random()*count);
//     Image.findOne().skip(random).exec(
//       function (err, imageRecord) {
//         if(err) {
//           res.json(err)
//         } else {
//           res.json(imageRecord)
//         }
//       }
//     )
//   })
// })
//
// function getOneImageRecordPromise() {
//   var thePromise= new Promise(function(resolve, reject) {
//     Image.count().exec(function(err,count) {
//       var random=Math.floor(Math.random()*count);
//       Image.findOne().skip(random).exec(
//         function (err, ImageRecords) {
//           resolve(ImageRecords) /// zzzz does not handle error correctly.
//         }
//       )
//     })
//   })
//   return(thePromise);
// }

//
// function testPromise() {
//   var thePromise= new Promise(function(resolve, reject) {
//     setTimeout(resolve,100,'foo')
//   })
//   return(thePromise);
// }
//
// console.log("I DID")
// getOneImageRecordPromise()
// .then((x)=>{
//   console.log("========WHAT IS THIS????");
//   console.log(x);
// })
// console.log("THIS WRONG")



let port = 3195;
app.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on port ${process.env.PORT || port}`);
});
