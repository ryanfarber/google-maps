// url-encoder.js


function encode(config = {}) {

	let avoidOptionsMap = new Map([
		["highways", "1b1"],
		["tolls", "2b1"],
		["ferries", "3b1"]
	])

	let modeOptionsMap = new Map([
		["driving", "3e0"],
		["bicycling", "3e1"],
		["walking", "3e2"],
		["transit", "3e3"],
		["flight", "3e4"]
	])

	let transitTypesMap = new Map([
		["bus", "5e0"],
		["subway", "5e1"],
		["train", "5e2"],
		["tram", "5e3"]
	])

	let timeOptionsMap = new Map([
		["arrivalTime", "6e1"],
		["departureTime", "6e0"]
	])

	let avoid = config.avoid || []
	let transitTypes = config.transitTypes || []
	let mode = config.mode || "driving"
	let arrivalTime = config.arrivalTime
	let departureTime = config.departureTime
	if (arrivalTime && departureTime) throw new Error("you may only specify arrival or departure time")
	let time = arrivalTime || departureTime


	let routeOptionsArr = []
	let transitTypesArr = []
	let transportationModeArr = []
	let timeArr = []
	let timeOptionsArr = []


	// push avoid
	avoid.forEach(x => {
		if (avoidOptionsMap.has(x)) routeOptionsArr.push(avoidOptionsMap.get(x))
	})

	// parse transit types
	transitTypes.forEach(x => {
		if (transitTypesMap.has(x)) transitTypesArr.push(transitTypesMap.get(x))
	})

	if (arrivalTime) timeOptionsArr.push(timeOptionsMap.get("arrivalTime"))
	else if (departureTime) timeOptionsArr.push(timeOptionsMap.get("departureTime"))

	if (mode) {
		if (!modeOptionsMap.has(mode)) throw new Error(`invalid transportation mode option "${mode}"`)
		transportationModeArr.push(modeOptionsMap.get(mode))
	}

	if(time) timeArr.push(time)

	let numAvoid = avoid.length
	let numTransitTypes = transitTypesArr.length
	let routeOptionsLength = routeOptionsArr.length 


	let timeField = (time) ? [`8j${timeArr.length}`, ...timeArr] : []
	let timeOptions = (time) ? [`6e${timeOptionsArr.length}`, ...timeOptionsArr] : []
	let transitTypeOptions = (transitTypesArr.length) ? [...transitTypesArr] : []
	let transportationMode = [...transportationModeArr]
	let routeOptions = [`2m${routeOptionsArr.length + transitTypeOptions.length + timeOptions.length + timeField.length}`, ...routeOptionsArr, ...transitTypeOptions, ...timeOptions, ...timeField]
	let directionsOptions = [`4m${routeOptions.length + transportationMode.length}`, ...routeOptions, ...transportationMode]
	let mapOptions = [`4m${directionsOptions.length}`, ...directionsOptions]



	console.log(`mapOptions: ${mapOptions}`)


	let final = mapOptions.join("!")

	console.log(`input:\n\n${JSON.stringify(config, null, 2)}`)
	let output = `data=!3m1!4b1!` + final
	console.log(`\noutput:\n\n${output}\n`)

	return output
}




module.exports = encode