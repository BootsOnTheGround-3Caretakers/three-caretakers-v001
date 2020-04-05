const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const restify = require("express-restify-mongoose");
const app = express();
const router = express.Router();
const cors = require("cors");
// const Storage = require("@google-cloud/storage");
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
// V0002 (ToddlerAPI) Schema
// (see https://docs.google.com/spreadsheets/d/1eypLAXlzGPenjPoNDPqgVsZotLbvCEtYYxaEm-oGFVg/edit#gid=1376543690)

var StandardNeedOffers = mongoose.model(
  "StandardNeedOffers",
  new mongoose.Schema({
     updated: { type: Date, default: Date.now },
     needOfferName: { type: String, default: Date.now },  //NEED
  })
);

// * Users
//   * Includes information on the GiveOffers
//   * includes location information, quite complex
//   * see schema
//   * Note, Geo (lat+long) is mainly stored here.


var Users = mongoose.model(
  "Users",
  new mongoose.Schema({
// {
     updated: { type: Date, default: Date.now },
//     "user_id" : 1592,
     user_id:  String,
//     "role" : "giver",
     role: String,
//     "name" : "Deborah Smith",
     officalName: String,
     alias: String,  // NEW
//     "email" : {
//         "address": "tommcclain@lynn.biz",
//         "verified": False
//     },
    email: {
      address: String,
      verified: Boolean,
      adminNotes: String,  //NEW Liam notes: messages , array, and timestamps of notes
    },

//     "phone" : {
//         "number": "597.356.3257x2539",
//         "verified": False
//     },
    phone: {
      number: String,
      verified: Boolean,
      adminNotes: String,  //NEW
    },
//
//     "biography": "fooBar Baz",
    biography: String,
//     "imageUrls": ["http://foo.com"],
    imageUrls: [String],
//     "otherUrls": [
//         {
//             "url": "http://foo.com",
//             "type": "social"
//         }
//     ],
    otherUrls: [ ASK LIAM ]

//     "criticalCategories": ["medical", "elderly"],
    criticalCategories: [String]  // should be typechecked, maybe enum from another table?
//     "address": {
//         "regionCode": string,
//         "languageCode": string,
//         "postalCode": string,
//         "sortingCode": string,
//         "administrativeArea": string,
//         "locality": string,
//         "sublocality": string,
//         "addressLines": [
//             string
//         ],
//         "geo" : {
//             "lat" : 39.849859,
//             "lon" : -84.54428
//         }
//     },
//     "hashTags" : [
//         {
//             "required": True,
//             "hashtagName": "foo",
//             "verified": False
//         }
//     ],
//     "isFirstResponder" : true,
//     "stillHaveToPhysicallyGoToWork" : false,
//     "giveOffer" : [
//         {
//             "name" : "NavigatingBureacracy",
//             "totalSlots" : 3,
//             "availableSlots" : 3,
//             "assignedSlots" : 0
//         }
//     ],
//     "redFlag": False,
//     "freeNotes": "adfasdf"
// }
   })
);


// * NeedRequests
//   * GEO: link via user, HASH: Y copied, NEED: Y main source
//   * has copied over hashtags
//   * The need information is stored here in `needName`
//

var NeederRequests = mongoose.model(
  "NeederRequests",
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


// * GiveOffers
//   * offerName
//   * totalSlots
//   * availableSlots
//   * assignedSlots



app.get('/versionName', function(req, res, next) {
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
