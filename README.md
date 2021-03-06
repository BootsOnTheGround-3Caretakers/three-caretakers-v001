# three-careakers-v001  -- "BabyAPI"

These are currently run off my server. I will not push to Heroku. I'm just leaving this on and using ngrok to tunnel. (I will update the server address below if it needs to change).

### Video of the tool being built. (early mockup)
http://tinyurl.com/Boots2min


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

There are 3 TableNames
* NeedersLookingForMatch
* CaretakersLookingForMatch
* MatchedClusters

Update 3/31. Added a table to deal with Twilio
* TwilioBlob

Example:
```
http://c29a9953.ngrok.io/api/v1/MatchedClusters
```
(clickable: http://c29a9953.ngrok.io/api/v1/MatchedClusters/count)
NOTE:: This no longer works (3/31). You have to put AUTHENTICATION in the HTTP header. You will get an authentication error. See 3/30 message on authentication in discord channel or read the server.js code.
NOTE: (4/4) We are turning on and off Authentication from time to time.

the `http://c29a9953.ngrok.io ` is the hostname as of 2:14pm US New York Time on SUN 3/22. If that host is dead, go to the discord and message @hocho

all variables are of string type.

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
