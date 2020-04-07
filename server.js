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

var mongodb_uri = process.env.NODE_ENV === 'dev' ?  process.env.MONGODB_URI : 'mongodb://liam:JumpJordanJump23@ds049598.mlab.com:49598/liamtest'
console.log(`NODE_ENV: ${process.env.NODE_ENV}, MONGODB_URI ${mongodb_uri}`);
mongoose.connect(mongodb_uri);
var Schema = mongoose.Schema;

// Define models
//
// V0002 (ToddlerAPI) Schema
// (see https://docs.google.com/spreadsheets/d/1eypLAXlzGPenjPoNDPqgVsZotLbvCEtYYxaEm-oGFVg/edit#gid=1376543690)

var StandardNeedOffersSchema = new mongoose.Schema({
   updated: { type: Date, default: Date.now },
   needOfferName: { type: String, unique: true },  //LIAM DONE HOCHO CHECK
})
var StandardNeedOffers = mongoose.model(
  "StandardNeedOffers",
  StandardNeedOffersSchema
);

var TagsSchema = new mongoose.Schema({
   updated: { type: Date, default: Date.now },
   "approved": Boolean,
   hashtagName: { type: String, unique: true },  //LIAM DONE HOCHO CHECK
})


var Tags = mongoose.model(
  "Tags",
  TagsSchema,
);

var CriticalGroupsSchema = new mongoose.Schema({
   updated: { type: Date, default: Date.now },
   CiritcalGroupName: { type: String, unique: true, required: true },  //LIAM DONE HOCHO CHECK
})
var CriticalGroups = mongoose.model(
  "CriticalGroups",
  CriticalGroupsSchema
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
      adminNotes: String,  //NEW
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
    otherUrls: [ //LIAM DONE
      {
        url: String,
        type: String,
      }
    ],

//     "criticalCategories": ["medical", "elderly"],
    criticalCategories: [   {
                   type: Schema.Types.ObjectId,
                   ref: "CriticalGroups",
                 }   ],  // LIAM DONE HOCHO CHECKED should be typechecked, Later: maybe enum from another table?

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
    address: {
        "regionCode": String, // TODO: enum on the server before doing a write.
        "languageCode": String,
        "postalCode": String,
        "sortingCode": String,
        "administrativeArea": String,
        "locality": String,
        "sublocality": String,
        "addressLines": [
            String
        ],
        "geo" : {
            "lat" : Number,
            "lon" : Number,
        },
    },
//     "hashTags" : [
//         {
//             "required": True,
//             "hashtagName": "foo",
//             "verified": False
//         }
//     ],

    "HashTags" : [  /// TODO in server logic: put some restrictions on creation of new hashtags,
                    ///  so as not to overload the server.  //HC: this is the approved field. We will only display/tabulate approved hashtags. Unapproved are tracked but not used for tabulations. Maybe use it for matching.
                    {
                                 type: Schema.Types.ObjectId,
                                 ref: "Tags",
                               }
    ],

//     "isFirstResponder" : true,
    "isFirstResponder" : Boolean,

//     "stillHaveToPhysicallyGoToWork" : false,
    "stillHaveToPhysicallyGoToWork" : Boolean,

//     "giveOffer" : [
//         {
//             "name" : "NavigatingBureacracy",
//             "totalSlots" : 3,
//             "availableSlots" : 3,
//             "assignedSlots" : 0
//         }
//     ],

"giveOffer" : [              {
               type: Schema.Types.ObjectId,
               ref: "GiveOffers",
             }
], //LIAM, can you check that?

//     "redFlag": False,
    "redFlag": Boolean,

//     "freeNotes": "adfasdf"
    "freeNotes": String,
   })
);


// * NeedRequests
//   * GEO: link via user, HASH: Y copied, NEED: Y main source
//   * has copied over hashtags
//   * The need information is stored here in `needName`
//

var NeedRequests = mongoose.model(
  "NeedRequests",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    // sample NeedRequest:

    // {
    //           "user_id" : 25000,
    "linkedNeeder_user_id" :              {
                   type: Schema.Types.ObjectId,
                   ref: "Users",
                 } ,  // LIAM HELP/DOUBLECHECK: I just want the id for the user.   See: https://mongoosejs.com/docs/guide.html#_id

    //           "geo" : {
    //             "lat" : 39.475889,
    //             "lon" : -82.07959
    //           },
          "geo" : {
            "lat" : Number,
            "lon" : Number,
          },
    //           "tags" : [
    //             {name: "Baptist","required": Boolean }   // NEW
    //             "english",
    //             "teacher",
    //             "LowIncome"
    //           ],
          hashTags: [ {
            tag: {
              type: Schema.Types.ObjectId,
              ref: "Tags",
            },
            requiredThisTag: Boolean, //If required, then
          }],
    //           "needName" : [
    //             "MedicationPickup"
    //           ],
          PrimaryNeedName :
            {
              type: Schema.Types.ObjectId,
              ref: "StandardNeedOffers",
            },
          "nonPrimaryNeedNames" : [
            {
              type: Schema.Types.ObjectId,
              ref: "StandardNeedOffers",
            }
          ],

           "assignedGivers" : [
             {
               type: Schema.Types.ObjectId,
               ref: "Users",
             }
           ],  // LIAM, see what you did for the ids in linkedNeeder_user_id, but here it's an array
              //HOCHO guess, Liam, please check


    //           "cluster" : {
    //             "userRequestedLimit" : 3,
    //             "adminRequestedLimit" : 2,
    //             "assigned" : 0,
    //             "remainingNeeded" : 3
    //           },
          "clusterSizeParameters" : {
              "userRequestedLimit" : Number,
              "adminRequestedLimit" : Number,
              "assigned" : Number,
              "remainingNeeded" : Number
            },
    //           "priority" : 4
          priority: Number, // higher number is higher priority
    //         }
  })
);


// * GiveOffers
var GiveOfferSchema=new mongoose.Schema({
  updated: { type: Date, default: Date.now },
  "name" : String,
  "totalSlots" : Number,
  "availableSlots" : Number,
  "assignedSlots" : Number,
});
var GiveOffers = mongoose.model(
  "GiveOffers",
  GiveOfferSchema,
);


restify.serve(router, Tags);  //moved here (earlier to not require authentication).

app.get('/versionName', function(req, res, next) {
  res.send("ToddlerAPI 4_5_2020, simple authentication is off.")
});

app.use(function(req, res, next) {
  console.log(req.get('Authorization Needed'));
  next();
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


restify.serve(router, GiveOffers);
// restify.serve(router, Tags);  //moved earlier to not require authentication.
restify.serve(router, NeedRequests);
restify.serve(router, CriticalGroups);
restify.serve(router, StandardNeedOffers);
restify.serve(router, Users);

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



let port = 3195; // backupPort if none specified
app.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on port ${process.env.PORT || port}`);
});

// needed for testing, Mocha/Chai (liam 4/7)
module.exports = { app, GiveOffers, NeedRequests, CriticalGroups, Tags, StandardNeedOffers, Users}
