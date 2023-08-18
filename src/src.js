// src.js

// const {Client} = require("@googlemaps/google-maps-services-js")
const axios = require("axios")
const Logger = require("@ryanforever/logger").v2
const logger = new Logger(__filename, {debug: true})
const kindof = require("kind-of")
const qs = require("querystring")

const {placesFieldMasks, routesFieldMasks, Route, RouteV2, directionModes, directionAvoids} = require("./data.js")


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
				data: {
					textQuery: query
				},
				headers: {
					"X-Goog-FieldMask": placesFieldMasks.join(",")
				}
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

		this.route = async function(startId, endId) {

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

		this.getDirections = async function(config = {}) {
			logger.debug(`creating directions...`)
			let startId = config.startId
			let endId = config.endId
			let mode = config.mode || "driving"
			let avoid = config.avoid || []

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
					avoid
				},
				headers: {
					"X-Goog-FieldMask": routesFieldMasks.join(",")
				}
			}).catch(handleError)


			let raw = res.data
			let route = new RouteV2(raw)
			route.startId = startId
			route.endId = endId
			route.mode = mode
			route.avoid = avoid
			route.directionsUrl = createDirectionsUrl({startId, endId, mode, avoid})

			return route
		}

		function createDirectionsUrl(data = {}) {
			logger.debug("creating directions url...")
			let url = "https://www.google.com/maps/dir/?api=1&"
			let query = qs.stringify({
				origin: "a",
				destination: "b",
				origin_place_id: data.startId,
				destination_place_id: data.endId,
				travelmode: data.mode,
				// dir_action: data.action || "navigate"
			})
			url = url + query
			return url
		}

		function handleError(err) {
			let data = err.response.data?.error || err?.response?.data?.error_message || err.response?.data
			console.error(JSON.stringify(data, null, 2))
		}

		function formatPlaceId(id) {
			return `place_id:${id}`
		}
 	
	}
}



module.exports = GoogleMaps