// test.js

require("dotenv").config({path: "./.env"})
const GoogleMaps = require("./src")
const maps = new GoogleMaps({
	key: process.env.GOOGLE_MAPS_API_KEY
})



// maps.search("Charles de Gaulle Airport").then(console.log)
// maps.getPlaceDetails("ChIJHTtq-rF15kcRIoTbQ9feeJ0").then(console.log)

// maps.route("ChIJn82-Depv5kcRVtw33lEC4is", "ChIJW89MjgM-5kcRLKZbL5jgKwQ")

// maps.getDirections("ChIJn82-Depv5kcRVtw33lEC4is", "ChIJW89MjgM-5kcRLKZbL5jgKwQ")

// maps.getDirections({
// 	startId: "ChIJn82-Depv5kcRVtw33lEC4is",
// 	endId: "ChIJW89MjgM-5kcRLKZbL5jgKwQ",
// 	mode: "driving",
// 	avoid: ["tolls"]
// }).then(console.log)

maps.search("HOTEL DU COLLECTIONNEUR, 51-57 RUE DE COURCELLES,  PARIS").then(console.log)

