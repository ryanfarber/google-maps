
const kindof = require("kind-of")

class Base {
	kindof
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




module.exports = Base