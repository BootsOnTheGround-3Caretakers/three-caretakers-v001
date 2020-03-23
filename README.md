# three-careakers-v001  -- "BabyAPI"

These are currently run off my server. I will be pushing to heroku soon.

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

Example:
```
http://c29a9953.ngrok.io/api/v1/NeedersLookingForMatch
```
That means, you can type that in your browser or Postman and should see a JSON result. 

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
  ZipCode: String,
  Description: String,
  Custom1: String,
  Custom2: String,
}))
```

```
var CaretakersLookingForMatch= mongoose.model('CaretakersLookingForMatch', new mongoose.Schema({
  email: String,
  name: String,
  ZipCode: String,
  Description: String,
  Custom1: String,
  Custom2: String,
}))
```

```
var MatchedClusters= mongoose.model('MatchedClusters', new mongoose.Schema({
  NeederEmail: String,
  ZipCodeCommon: String,
  Caretaker1Email: String,
  Caretaker2Email: String,
  Caretaker3Email: String,
  ExtraJSONstrings: String // This is a JSONstringify of an object with the 1Needer+3Caretakers.
       // No standard is set on this. Carefully check the object to see if it conforms
       // to what you expect. I suggest storing a "typekey" in the object so you
       // can tell your call to the v001 database API works.
}))
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
