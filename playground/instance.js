// instance.js

require("dotenv").config({path: "../.env"})
const GoogleMaps = require("../src")
module.exports = new GoogleMaps({
	key: process.env.GOOGLE_MAPS_API_KEY
})
