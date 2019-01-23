const fetch = require("node-fetch");
const fs = require("fs-extra");

const NODE_DATA_URL = "https://node-db.netlify.com/nodes.json";
const PRECISION = 4;

fetch(NODE_DATA_URL)
	.then(res => res.json())
	.then(nodes => {
		// Create a map of rounded coordinates and lists of building ids
		const nodesByCoords = nodes.reduce((acc, cur) => {
			const [lat, lng] = cur.coordinates;
			const roundedLat = lat.toFixed(PRECISION);
			const roundedLng = lng.toFixed(PRECISION);
			const key = `${roundedLat},${roundedLng}`;
			acc[key] = acc[key] || [];
			acc[key].push(cur.id);
			return acc;
		}, {});

		// Get all lists with more than one building
		const sameBuilding = [];
		Object.keys(nodesByCoords).forEach(key => {
			if (nodesByCoords[key].length > 1) {
				sameBuilding.push(nodesByCoords[key]);
			}
		});

		// Write to file
		fs.outputJSON("./out/sameBuilding.json", sameBuilding, { spaces: 2 });
	})
	.catch(error => console.log(error));
