// schemas.js

const kindof = require("kind-of")
const {placesFieldMasks, routesFieldMasks, directionModes, directionAvoids, trafficModels} = require("./data.js")
const {html2text} = require("./helpers.js")

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

	validate(name, valid = [], input) {
		if (!name) throw new Error("please specify a property name")
		if (!valid.length) throw new Error(`please input valid options for "${name}"`)
		if (!input) return undefined

		let test = []
		if (kindof(input) == "string") test = [input]
		else test = [...input]

		test.forEach(x => {
			if (!valid.some(y => x == y)) throw new Error(`${name} must be one of [${valid.join("|")}]\nreceived "${input}"`)
		})
		return input
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

class RouteV3 extends Base {
	constructor(data = {raw: {}}) {
		super()
		let raw = data?.raw?.routes[0]?.legs[0]
		let rawFrench = data?.rawFrench?.routes[0]?.legs[0]
		this.startAddress = raw.start_address
		this.endAddress = raw.end_address
		this.startPlaceId = data.startPlaceId
		this.endPlaceId = data.endPlaceId
		this.mode = data.mode
		this.avoid = data.avoid
		this.trafficModel = data.trafficModel
		this.departureTime = data.departureTime
		this.arrivalTime = data.arrivalTime
		this.transitMode = data.transitMode
		this.durationMins = this.secsToMins(raw?.duration?.value)
		this.distanceMeters = raw?.distance?.value
		this.distanceKilometers = this.metersToKilometers(raw?.distance?.value)
		this.distanceMiles = this.metersToMiles(raw?.distance?.value)
		this.directionsUrl = data.directionsUrl
		this.warnings = data?.raw?.routes[0]?.warnings
		this.steps = raw.steps.map(x => new StepV2(x))
		this.stepsFrench = rawFrench.steps.map(x => new StepV2(x))
		this.raw = {}

		Object.defineProperty(this, "raw", {
			get() {return raw}
		})
	}
}


class StepV2 extends Base {
	constructor(raw) {
		super()
		this.instructions = html2text(raw?.html_instructions)
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




module.exports = {Base, Route, RouteV2, RouteV3, Step, StepV2}