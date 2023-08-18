# google-maps
google maps api

## quick start
```javascript
const GoogleMaps = require("@ryanforever/google-maps")
const maps = new GoogleMaps({
	key: process.env.GOOGLE_MAPS_API_KEY
})

maps.search("paris, france").then(console.log) // search for a location
```