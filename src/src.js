// src.js

// const {Client} = require("@googlemaps/google-maps-services-js")
const axios = require("axios")
const Logger = require("@ryanforever/logger").v2
const logger = new Logger("google maps api", {debug: true})
const kindof = require("kind-of")
const qs = require("querystring")
const {validate}  = require("./helpers.js")

const {
	placesFieldMasks, 
	routesFieldMasks, 
	directionModes, 
	directionAvoids, 
	transitModes, 
	trafficModels
} = require("./data.js")

const {
	Route,
	RouteV2,
	RouteV3
} = require("./schemas.js")


class GoogleMaps {
	constructor(config = {}) {

		// const client = new Client()
		const key = config.key
		if (!key) throw new Error("please provide your google maps api key as [key]")

		axios.defaults.headers.common = {
			"X-Goog-Api-Key": key,
			"Content-Type": "application/json",
		}
		axios.defaults.params = {}
		axios.defaults.params.key = key


		/** search for a place */
		this.search = async function(query) {
			logger.debug(`searching for ${query}...`)
			
			let res = await axios({
				url: "https://places.googleapis.com/v1/places:searchText",
				method: "POST",
				data: {textQuery: query},
				headers: {"X-Goog-FieldMask": placesFieldMasks.join(",")}
			})
			let data = res.data?.places || []
			return data
		}

		/** get place details with a given place id */
		this.getPlaceDetails = async function(id) {
			logger.debug("getting place details")
			let res = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
				params: {
					place_id: id
				}
			}).catch(handleError)

			let data = res.data?.result
			return data
		}

		this.getDirections = async function(config = {}) {
			logger.debug(`creating directions...`)
			let startId = config.startId
			let endId = config.endId
			let mode = config.mode || "driving"
			let avoid = config.avoid || []
			let returnRaw = config.returnRaw


			if (!startId) throw new Error("missing origin placeId")
			if (!endId) throw new Error("missing destination placeId")
			if (!directionModes.some(x => x == mode)) throw new Error(`direction mode must be one of [${directionModes.join("|")}]`)
			if (kindof(avoid) == "string") avoid = [avoid]
			avoid.forEach(x => {
				if (!directionAvoids.some(y => x == y)) throw new Error(`avoid paramater must be one of [${directionAvoids.join("|")}]`)
			})
			let avoidString = (avoid.length) ? avoid.join("|") : undefined

			let res = await axios({
				url: "https://maps.googleapis.com/maps/api/directions/json",
				method: "GET",
				params: {
					origin: formatPlaceId(startId),
					destination: formatPlaceId(endId),
					mode,
					avoid,
				},
				headers: {
					"X-Goog-FieldMask": routesFieldMasks.join(",")
				}
			}).catch(err => {
				let error = new Error(err)
				error.details = err.response.data
				throw error
			})


			let raw = res.data

			if (returnRaw) return JSON.stringify(raw, null, 2)
			let route = new RouteV2(raw)
			route.startId = startId
			route.endId = endId
			route.mode = mode
			route.avoid = avoid
			route.directionsUrl = createDirectionsUrl({startId, endId, mode, avoid})

			return route
		}

		/** get directions */
		this.getDirectionsV2 = async function(config = {}) {
			logger.debug(`getting directions...`)

			let startPlaceId = config.startPlaceId
			let endPlaceId = config.endPlaceId
			let mode = config.mode || "driving"
			let avoid = config.avoid || []
			let trafficModel = config.trafficModel || "best_guess"
			let departureTime = config.departureTime
			let arrivalTime = config.arrivalTime
			let language = config.language
			let transitMode = config.transitMode || []

			validate("mode", directionModes, mode)

			if (!startPlaceId) throw new Error("missing startPlaceId")
			if (!endPlaceId) throw new Error("missing endPlaceId")
			if (!directionModes.some(x => x == mode)) throw new Error(`direction mode must be one of [${directionModes.join("|")}]`)
			if (kindof(avoid) == "string") avoid = [avoid]
			avoid.forEach(x => {
				if (!directionAvoids.some(y => x == y)) throw new Error(`avoid paramater must be one of [${directionAvoids.join("|")}]`)
			})
			let avoidString = (avoid.length) ? avoid.join("|") : undefined

			let res = await req("en")
			let resFrench = await req("fr")

			let raw = res.data
			let route = new RouteV3({
				startPlaceId: startPlaceId,
				endPlaceId: endPlaceId,
				mode,
				transitMode: config.transitMode,
				avoid,
				trafficModel,
				directionsUrl: createDirectionsUrl({startPlaceId, endPlaceId, mode, avoid, transitMode}),
				raw: res.data,
				rawFrench: resFrench.data
			})
			return route

			async function req(language) {

				return await axios({
					url: "https://maps.googleapis.com/maps/api/directions/json",
					method: "GET",
					params: {
						origin: formatPlaceId(startPlaceId),
						destination: formatPlaceId(endPlaceId),
						mode,
						avoid,
						language,
						transit_mode: transitMode.join("|")
						// traffic_model: trafficModel
					},
					headers: {
						"X-Goog-FieldMask": routesFieldMasks.join(",")
					}
				}).catch(err => {
					let error = new Error(err)
					error.details = err.response.data
					throw error
				})

			}
		}

		this.route = async function(startId, endId) {
			logger.deprecated("do not use!")
			let res = await axios({
				url: "https://routes.googleapis.com/directions/v2:computeRoutes",
				method: "POST",
				data: {
					origin: {
						placeId: startId
					},
					destination: {
						placeId: endId
					},
					travelMode: "DRIVE",
					routingPreference: "TRAFFIC_AWARE",
					// departureTime: new Date(Date.now())
				},
				headers: {
					"X-Goog-FieldMask": routesFieldMasks.join(",")
				}
			}).catch(handleError)
			let raw = res.data?.routes
			console.log(raw)
			let data = raw.map(x => new Route(x))
			console.log(data[0])
			// console.log(data[0].legs[0].steps)
			// console.log(data[0].localizedValues)

		}

		this.routeV2 = async function(config = {}) {
			logger.debug(`getting route (v2)...`)

			let travelModes = new Map([
				["driving", "DRIVE"],
				["drive", "DRIVE"],
				["bike", "BICYCLE"],
				["bicycle", "BICYCLE"],
				["walking", "WALK"],
				["walk", "WALK"],
				["transit", "TRANSIT"],
				["motorcycle", "TWO_WHEELER"],
				["twoWheeler", "TWO_WHEELER"],
				["two_wheeler", "TWO_WHEELER"],
				["two wheeler", "TWO_WHEELER"]
			])

			let routingPreferences = new Map([
				["traffic_unaware", "TRAFFIC_UNAWARE"],
				["traffic_aware", "TRAFFIC_AWARE"],
				["optimal", "TRAFFIC_AWARE_OPTIMAL"],
				["traffic_aware_optimal", "TRAFFIC_AWARE_OPTIMAL"]
			])

			let startPlaceId = config.startPlaceId
			let endPlaceId = config.endPlaceId
			let startAddress = config.startAddress
			let endAddress = config.endAddress
			let departureTime = config.departureTime
			let arrivalTime = config.arrivalTime
			let travelMode = travelModes.get(config.travelMode) || "drive"

			if (!startPlaceId) throw new Error("missing startPlaceId")
			if (!endPlaceId) throw new Error("missing endPlaceId")

			let validRouteModifiers = ["avoidTolls", "avoidHighways", "avoidFerries", "avoidIndoor"]

			let routeModifiers = {}

			// if user supplised route modifiers
			if (config?.routeModifiers?.length) {
				// iterate thru their modifiers
				for (let x of config.routeModifiers) {
					// warn if a modifier is not correct, but don't throw error???
					if (!validRouteModifiers.includes(x)) {
						logger.warn(`"${x}" is not a valid route modifier`)
						continue
					}
					// set route modifier
					routeModifiers[x] = true
				}
			}

			let query = {
				origin: {placeId: startPlaceId},
				destination: {placeId: endPlaceId},
				travelMode,
				routingPreference: routingPreferences.get(config.routingPreference) || "TRAFFIC_AWARE_OPTIMAL",
				departureTime,
				arrivalTime,
				routeModifiers,
				languageCode: "en-US"
			}

			let res = await axios({
				url: "https://routes.googleapis.com/directions/v2:computeRoutes",
				method: "POST",
				data: query,
				headers: {
					"X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.staticDuration,routes.description,routes.legs.steps.navigationInstruction,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration"
				}
			}).catch(err => {
				let message = handleError(err)
				let error = new Error(err)
				error.description = message
				throw error
			})
			let raw = res.data
			console.log(stringify(raw))
		}

		this.createDirectionsUrl = function(data = {}) {
			const encodeUrl = require("./helpers/url-encoder.js")
			logger.debug("creating directions url...")
			let url = "https://www.google.com/maps/dir/?api=1&"
			let query = qs.stringify({
				origin: data.startPlaceId,
				destination: data.endPlaceId,
				origin_place_id: data.startPlaceId,
				destination_place_id: data.endPlaceId,
				travelmode: data.mode,
				// avoid: data.avoid.join("|"),
				// transit_mode: data.transitMode.join("|"),
				// dir_action: data.action || "navigate"
			})
			url = url + query
			return url
		}

		this.getPhoto = async function(photoReference) {
			let url = "https://maps.googleapis.com/maps/api/place/photo/"
			let res = await axios.get(url, {
				params: {
					photo_reference: photoReference,
					// key
				}
			}).catch(err => {
				throw err
			})
			let data = res.data
			console.log(data)
		}

		/** parses the address components field into it's constituents */
		this.parseAddressComponents = function(addressComponents = []) {
			let arr = addressComponents
			let streetNumber = arr.find(x => x.types.includes("street_number"))?.longText
			let address = arr.find(x => x.types.includes("route"))?.longText
			let addressShort = arr.find(x => x.types.includes("route"))?.shortText
			let address1 = `${streetNumber} ${address}`
			let city =  arr.find(x => x.types.includes("locality"))?.longText
			let state = arr.find(x => x.types.includes("administrative_area_level_1"))?.longText
			let stateAbbr = arr.find(x => x.types.includes("administrative_area_level_1"))?.shortText
			let country = arr.find(x => x.types.includes("country"))?.longText
			let countryAbbr = arr.find(x => x.types.includes("country"))?.shortText
			let zipcode = arr.find(x => x.types.includes("postal_code"))?.longText
			let zipcodeSuffix =arr.find(x => x.types.includes("postal_code_suffix"))?.longText
			return {streetNumber, address, addressShort, address1, city, state, stateAbbr, zipcode, zipcodeSuffix, country, countryAbbr}
		}

		function handleError(err) {
			let data = err.response.data?.error || err?.response?.data?.error_message || err?.response?.data?.error?.message || err.response?.data
			// console.error(JSON.stringify(data, null, 2))
			return data
		}

		function formatPlaceId(id) {
			return `place_id:${id}`
		}

		function stringify(obj = {}) {
			return JSON.stringify(obj, null, 2)
		}
 	
	}
}



module.exports = GoogleMaps