// data.js

const { convert } = require("html-to-text")
const kindof = require("kind-of")

let placesFieldMasks = [
	"places.id",
	"places.name",
	"places.addressComponents",
	"places.adrFormatAddress",
	"places.businessStatus",
	"places.displayName",
	"places.formattedAddress",
	"places.googleMapsUri",
	"places.iconBackgroundColor",
	"places.iconMaskBaseUri",
	"places.location",
	"places.photos",
	"places.plusCode",
	"places.types",
	"places.utcOffsetMinutes",
	"places.viewport",
	"places.wheelchairAccessibleEntrance",
	"places.internationalPhoneNumber",
	"places.nationalPhoneNumber",
	"places.openingHours",
	"places.currentOpeningHours",
	"places.secondaryOpeningHours",
	"places.currentSecondaryOpeningHours",
	"places.websiteUri",
	"places.curbsidePickup",
	"places.delivery",
	"places.dineIn",
	"places.editorialSummary",
	"places.priceLevel",
	"places.rating",
	"places.reservable",
	"places.reviews",
	"places.servesBeer",
	"places.servesBreakfast",
	"places.servesBrunch",
	"places.servesDinner",
	"places.servesLunch",
	"places.servesVegetarianFood",
	"places.servesWine",
	"places.takeout",
	"places.userRatingCount",

]

let routesFieldMasks = [
	"routes.duration",
	"routes.distanceMeters",
	// "routes.polyline.encodedPolyline",
	"routes.legs",
	"routes.routeLabels",
	"routes.localizedValues",
	"routes.route_token",

	// "routes.geocodingResult"
]

let directionModes = [
	"walking",
	"driving",
	"bicycling",
	"transit"
]

let directionAvoids = [
	"tolls",
	"highways",
	"ferries",
	"indoor"
]

let transitModes = [
	"bus",
	"subway",
	"train",
	"tram",
	"rail"
]

let trafficModels = [
	"best_guess",
	"pessimistic",
	"optimistic"
]




module.exports = {placesFieldMasks, routesFieldMasks, directionModes, directionAvoids}



