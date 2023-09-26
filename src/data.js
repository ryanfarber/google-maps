// data.js

const { convert } = require("html-to-text")
const kindof = require("kind-of")

module.exports.placesFieldMasks = [
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
	// "places.photos",
	// "places.plusCode",
	"places.types",
	"places.utcOffsetMinutes",
	// "places.viewport",
	"places.wheelchairAccessibleEntrance",
	"places.internationalPhoneNumber",
	"places.nationalPhoneNumber",
	// "places.openingHours",
	// "places.currentOpeningHours",
	// "places.secondaryOpeningHours",
	// "places.currentSecondaryOpeningHours",
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

module.exports.placeFieldsV2 = [
	// "address_components",
	// "adr_address",
	"business_status",
	"formatted_address",
	"geometry/viewport",
	"geometry/location",
	"icon",
	"icon_mask_base_uri",
	"icon_background_color",
	"name",
	"permanently_closed",
	"photos",
	"place_id",
	"plus_code",
	"type",
	// "url",
	// "utc_offset",
	// "vicinity",
	// "wheelchair_accessible_entrance",
	// "formatted_phone_number",
	// "international_phone_number",
	"opening_hours",
	// "current_opening_hours",
	// "secondary_opening_hours",
	// "website",
	// "curbside_pickup",
	// "delivery",
	// "dine_in",
	// "editorial_summary",
	"price_level",
	"rating",
	// "reservable",
	// "reviews",
	// "serves_beer",
	// "serves_breakfast",
	// "serves_brunch",
	// "serves_dinner",
	// "serves_lunch",
	// "serves_vegetarian_food",
	// "serves_wine",
	// "takeout",
	// "user_ratings_total",
]

module.exports.routesFieldMasks = [
	"routes.duration",
	"routes.distanceMeters",
	// "routes.polyline.encodedPolyline",
	"routes.legs",
	"routes.routeLabels",
	"routes.localizedValues",
	"routes.route_token",

	// "routes.geocodingResult"
]

module.exports.directionModes = [
	"walking",
	"driving",
	"bicycling",
	"transit"
]

module.exports.directionAvoids = [
	"tolls",
	"highways",
	"ferries",
	"indoor"
]

module.exports.transitModes = [
	"bus",
	"subway",
	"train",
	"tram",
	"rail"
]

module.exports.trafficModels = [
	"best_guess",
	"pessimistic",
	"optimistic"
]







