// Route.js
const Base = require("./Base.js")

class Route extends Base {
	constructor(data = {raw: {routes: [], steps: []}, rawFrench: {routes: [], steps: []}, distance: {}, steps: []}) {
		super()

		let raw = data?.raw?.routes[0]?.legs[0] || {distance: {}, routes: {}}
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
		this.distanceMeters = raw.distance.value
		this.distanceKilometers = this.metersToKilometers(raw?.distance?.value)
		this.distanceMiles = this.metersToMiles(raw?.distance?.value)
		this.directionsUrl = data.directionsUrl
		this.warnings = data?.raw?.routes[0]?.warnings
		this.steps = raw?.steps?.map(x => new StepV2(x))
		this.stepsFrench = rawFrench?.steps?.map(x => new StepV2(x))
		this.raw = {}

		Object.defineProperty(this, "raw", {get() {return raw}})
	}
}



module.exports = Route