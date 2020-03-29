var NeedersLookingForMatch = mongoose.model(
  "NeedersLookingForMatch",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    email: String,
    name: String,
    Lat: Number, // latitude
    Long: Number,  // longitude
    NeedDescription: String, // This is the need description //TODO ZZZZ: change this to NeedsDescription, an array
    AdditionalInfo: String, //profile info, not used for matching
                            // longer information, like a narrative of what happened, context.
                            // They can also provide a facebook/IG/ link.
    Hashtags: String, // Hashtags. Example "#VETERAN, #LGBT, #PREGNANT, #SPANISHSPEAKER"
    RequestedClusterSize: Number, //if empty, assume 3. A hospital might make a request for 45 helpers for something
    Custom1: String,
    Custom2: String,
  })
);


// Hashtags. Example "#VETERAN, #LGBT, #PREGNANT"
var CaretakersLookingForMatch = mongoose.model(
  "CaretakersLookingForMatch",
  new mongoose.Schema({
    updated: { type: Date, default: Date.now },
    email: String,
    name: String,
    Lat: Number, 
    Long: Number,
    CareDescription: [String], // an array of strings that match exactly to the need. I.e.,
                              // needDescription="Grocery Pickup" and careDescription="Grocery Pickup"
    AdditionalInfo: String,    //profile info, not used for matching
    Hashtags: String, // Hashtags. Example "#VETERAN, #LGBT, #PREGNANT, #SPANISHSPEAKER"
    SlotCount: Number, // deafualt to 1, 6 means they'd be happy to be matched into 6 clusters. I.e. they are bored/helpful
    Custom1: String,   //not used for matching
    Custom2: String,   //not used for matching
  })
);
