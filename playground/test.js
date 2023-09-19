// test.js

require("dotenv").config({path: "../.env"})
const GoogleMaps = require("../src")
const maps = new GoogleMaps({
	key: process.env.GOOGLE_MAPS_API_KEY
})




// let url = maps.createDirectionsUrl({
// 	startPlaceId: "ChIJOYNm1DBu5kcRZwdtKBzyq6k",
// 	endPlaceId: "ChIJAQquYc1v5kcRLKslDuENAxg",
// 	// mode: "transit"
// 	transitTypes: ["bus"]
// })
// console.log(url)


// maps.routeV2({
// 	startPlaceId: "ChIJOYNm1DBu5kcRZwdtKBzyq6k",
// 	endPlaceId: "ChIJAQquYc1v5kcRLKslDuENAxg"
// }).then(console.log)

// maps.search("Charles de Gaulle Airport").then(console.log)
// maps.getPlaceDetails("ChIJHTtq-rF15kcRIoTbQ9feeJ0").then(console.log)

// maps.route("ChIJn82-Depv5kcRVtw33lEC4is", "ChIJW89MjgM-5kcRLKZbL5jgKwQ")

// maps.getDirections("ChIJn82-Depv5kcRVtw33lEC4is", "ChIJW89MjgM-5kcRLKZbL5jgKwQ")

// maps.getDirections({
// 	startId: "ChIJn82-Depv5kcRVtw33lEC4is",
// 	endId: "ChIJW89MjgM-5kcRLKZbL5jgKwQ",
// 	returnRaw: true,
// 	// mode: "transit",
// 	// avoid: ["tolls"],
// 	// trafficModel: "pessimistic"
// }).then(console.log)

// maps.getDirectionsV2({
// 	startPlaceId: "ChIJW89MjgM-5kcRLKZbL5jgKwQ",
// 	endPlaceId: "ChIJn82-Depv5kcRVtw33lEC4is",
// 	mode: "driving",
// 	// transitMode: ["train", "bus"],
// 	returnRaw: false,
// 	avoid: ["tolls", "highways"],
// 	// trafficModel: "pessimistic"
// }).then(res => {
// 	console.log(res)
// })

// maps.routeV2({
// 	startPlaceId: "ChIJW89MjgM-5kcRLKZbL5jgKwQ",
// 	endPlaceId: "ChIJn82-Depv5kcRVtw33lEC4is",
// 	mode: "drive",
// 	routeModifiers: ["avoidTolls", "avoidFerries"]
// 	// avoid: ["avoidTolls", "avoidFerries", "avoide"]
// })

// maps.search("HOTEL DU COLLECTIONNEUR, 51-57 RUE DE COURCELLES,  PARIS").then(console.log)



// maps.search("hotel balzac").then(res => {
// 	let item = res[0]
// 	console.log(item)
// 	console.log(maps.parseAddressComponents(item.addressComponents))
// 	maps.getPlaceDetails(item.id).then(res => {
// 		console.log(res.photos)
// 	})
// })

maps.getPlaceDetails("ChIJn82-Depv5kcRVtw33lEC4is").then(res => {
	// console.log(res)
	console.log(res.address_components)
	console.log(maps.parseAddressComponents(res.address_components))
})



