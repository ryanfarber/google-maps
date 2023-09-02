// helpers.js
const kindof = require("kind-of")
const { convert } = require("html-to-text")


function validate(name, valid = [], input) {
	if (!name) throw new Error("please specify a property name")
	if (!valid.length) throw new Error("please input valid options")
	if (!input) return undefined

	let test = []
	if (kindof(input) == "string") test = [input]
	else test = [...input]

	test.forEach(x => {
		if (!valid.some(y => x == y)) throw new Error(`${name} must be one of [${valid.join("|")}]\nreceived "${input}"`)
	})
	return input
}

function html2text(html) {
	return convert(html)
}




module.exports = {validate, html2text}