# three-careakers-v002  -- "ToddlerAPI" branch

Builds on the "BabyAPI", but
1) changes the schema to closer match the DanielAPI.
2) adds authentication/server key.

These are currently run off my server. I will not push to Heroku. I'm just leaving this on and using ngrok to tunnel. (I will update the server address below if it needs to change).

### Routes
These are the routes: (replace the replaceme.com with the IP and port or hostname and port)

```
GET http://replaceme.com/api/v1/Customer/count
GET http://replaceme.com/api/v1/Customer
POST http://replaceme.com/api/v1/Customer
DELETE http://replaceme.com/api/v1/Customer

GET http://replaceme.com/api/v1/Customer/:id
GET http://replaceme.com/api/v1/Customer/:id/shallow
PUT http://replaceme.com/api/v1/Customer/:id
POST http://replaceme.com/api/v1/Customer/:id
PATCH http://replaceme.com/api/v1/Customer/:id
DELETE http://replaceme.com/api/v1/Customer/:id
```
Instead of Customer, use the table name.

** There are multiple TableNames

From 4/7:
```
restify.serve(router, GiveOffers);
restify.serve(router, NeedRequests);
restify.serve(router, CriticalGroups);
restify.serve(router, Tags);
restify.serve(router, StandardNeedOffers);
restify.serve(router, Users);
```
Look at server.js

****


**** Older, out of date, but gives the "feel of it"
(see more details here: https://docs.google.com/spreadsheets/d/1eypLAXlzGPenjPoNDPqgVsZotLbvCEtYYxaEm-oGFVg/edit?usp=sharing
  NOTE: multiple worksheets in the workbook)

* Users
  * Includes information on the GiveOffers
  * includes location information, quite complex
  * see schema
  * Note, Geo (lat+long) is mainly stored here.

* NeedRequests
  * GEO: link via user, HASH: Y copied, NEED: Y main source
  * has copied over hashtags
  * The need information is stored here in `needName`

* GiveOffers
  * offerName
  * totalSlots
  * availableSlots
  * assignedSlots


Example:
```
NEW NGROK
```
(clickable: NEWNGROK alternative: https://threecaregivers.pagekite.me/api/v1/Tags/count )
(clickable: NEWNGROK alternative: https://threecaregivers.pagekite.me/api/v1/Users/count  Needs authentication, should give error )

NOTE: TODO:  AUTHENTICATION in the HTTP header.
NOTE: (4/4) We are turning on and off Authentication from time to time.

the `https://threecaregivers.pagekite.me/ ` is the hostname as of 2:14pm US New York Time on SUN 3/22. If that host is dead, go to the discord and message @hocho


## Queries
More queries (like sort order) are in this doc. https://florianholzapfel.github.io/express-restify-mongoose/

##
This is the raw code (as of 3/20). Check the actual github in case there are changes.

```
var NeedersLookingForMatch= mongoose.model('NeedersLookingForMatch', new mongoose.Schema({
  email: String,
  name: String,
   // more fields and 3 tables.
  // LOOK FOR THE STUB in the server.js file
```

# Old Notes
<!-- For the Memes With Friends hackathon app, this github repo sets up two things:
1) Google Cloud Server (port 31023)
2) ImageMasterDeck for the game (port 3195)

To do this, run 'npm run startBoth';

All routes are exposed for Rodrigo's gameplay backend.

The only route you REALLY need to know is the route:
```
  10.2.102.226:31023/SpecialUpload
  method: POST
  key: file, value: the file as a fs.createWriteStream.
  ```

see googleCloudStorage.js.

Also, the IPv4 is hard coded and we need to be on the same network. If we get new IPv4, we need to manually change the code.
`10.2.102.226` -->
