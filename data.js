// data.js

const { convert } = require("html-to-text")

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

class Base {

	metersToMiles(meters) {
		return this.round(meters * 0.00062137)
	}

	metersToKilometers(meters) {
		return this.round(meters / 1000)
	}

	secsToMins(secs) {
		return parseFloat((secs / 60).toFixed(2))
	}

	metersToFeet(meters) {
		return parseFloat((meters * 3.28084).toFixed(2))
	}

	round(n, i) {
		if (!n) return
		i = i ?? 2
		return parseFloat(parseFloat(n).toFixed(i))
	}
}



class Route extends Base {
	constructor(raw = {}) {
		super()
		this.startId
		this.startAddress = raw.startAddress
		this.endId = raw.endId
		this.endAddress
		this.durationSecs = parseInt(raw.duration)
		this.durationMins = Math.floor(parseInt(raw.duration) / 60)
		this.distanceMeters = raw.distanceMeters
		this.distanceKilometers = this.metersToKilometers(raw.distanceMeters)
		// this.distanceMiles = this.metersToMiles(raw.distanceMeters)
		this.steps = raw.legs[0].steps.map(x => new Step(x))
		this.instructions = raw.legs[0].steps.map(x => x.navigationInstruction.instructions)
		// this.steps = raw.legs[0].steps
		console.log(raw.legs[0])
		this.raw = {}

		Object.defineProperty(this, "raw", {
			get() {
				return raw
			}
		})
	}
}

class Step extends Base {
	constructor(raw) {
		super()
		this.instructions = raw?.navigationInstruction?.instructions
		this.durationSecs = this.round(raw?.staticDuration)
		this.durationMins = this.secsToMins(raw?.staticDuration)
		this.raw = {}

		Object.defineProperty(this, "raw", {
			get() {return raw}
		})
	}
}



class RouteV2 extends Base {
	constructor(data = {}) {
		super()
		let raw = data.routes[0].legs[0]
		this.startAddress = raw.start_address
		this.endAddress = raw.end_address
		this.startId = undefined
		this.endId = undefined
		this.mode = undefined
		this.avoid = undefined
		this.durationMins = this.secsToMins(raw.duration?.value)
		this.distanceMeters = raw.distance.value
		this.distanceKilometers = this.metersToKilometers(raw.distance.value)
		this.distanceMiles = this.metersToMiles(raw.distance.value)
		this.directionsUrl = undefined
		this.warnings = data.routes[0].warnings
		this.steps = raw.steps.map(x => new StepV2(x))
		this.raw = {}

		Object.defineProperty(this, "raw", {
			get() {return raw}
		})
	}
}


class StepV2 extends Base {
	constructor(raw) {
		super()
		this.instructions = convert(raw?.html_instructions)
		this.distanceMeters = raw.distance.value
		this.distanceKilometers = this.metersToKilometers(raw.distance.value)
		this.distanceFeet = this.metersToFeet(raw.distance.value)
		this.distanceMiles = this.metersToMiles(raw.distance.value)
		this.durationMins = this.secsToMins(raw?.duration.value)
		this.raw = {}

		Object.defineProperty(this, "raw", {
			get() {
				return raw
			}
		})
	}
}


module.exports = {placesFieldMasks, routesFieldMasks, Route, RouteV2, StepV2, directionModes, directionAvoids}