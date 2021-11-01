// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE PAGE_CREATORS FOLDER

require("dotenv").config()
const fs = require("fs")
const output = "../cyberia/index.html"

const get = require("./functions/get.js")
const error_handler = require("./functions/error_handler.js")

p_objects = [
	{
		name: "C",
		maps: [
			{
				mod_id: "NM1",
				map_id: "420793"
			},
			{
				mod_id: "NM2",
				map_id: "2666657"
			},
			{
				mod_id: "NM3",
				map_id: "3078338"
			},
			{
				mod_id: "NM4",
				map_id: "3159459"
			},
			{
				mod_id: "HD1",
				map_id: "2937778"
			},
			{
				mod_id: "HD2",
				map_id: "106474"
			},
			{
				mod_id: "HR1",
				map_id: "303370"
			},
			{
				mod_id: "HR2",
				map_id: "3154824"
			},
			{
				mod_id: "DT1",
				map_id: "3158339"
			},
			{
				mod_id: "DT2",
				map_id: "2868550"
			},
			{
				mod_id: "EZ1",
				map_id: "122989"
			},
			{
				mod_id: "TB1",
				map_id: "1684705"
			}
		]
	},
	{
		name: "D",
		maps: [
			{
				mod_id: "NM1",
				map_id: "2846435"
			},
			{
				mod_id: "NM2",
				map_id: "2873261"
			},
			{
				mod_id: "NM3",
				map_id: "2039171"
			},
			{
				mod_id: "NM4",
				map_id: "3106089"
			},
			{
				mod_id: "NM5",
				map_id: "54708"
			},
			{
				mod_id: "HD1",
				map_id: "2353916"
			},
			{
				mod_id: "HD2",
				map_id: "57627"
			},
			{
				mod_id: "HR1",
				map_id: "909764"
			},
			{
				mod_id: "HR2",
				map_id: "2713279"
			},
			{
				mod_id: "DT1",
				map_id: "433101"
			},
			{
				mod_id: "DT2",
				map_id: "2850639"
			},
			{
				mod_id: "DT3",
				map_id: "395343"
			},
			{
				mod_id: "EZ1",
				map_id: "386781"
			},
			{
				mod_id: "TB1",
				map_id: "418725"
			}
		]
	},
	{
		name: "E",
		maps: [
			{
				mod_id: "NM1",
				map_id: "2199392"
			},
			{
				mod_id: "NM2",
				map_id: "354084"
			},
			{
				mod_id: "NM3",
				map_id: "2440455"
			},
			{
				mod_id: "NM4",
				map_id: "1208035"
			},
			{
				mod_id: "NM5",
				map_id: "3097864"
			},
			{
				mod_id: "HD1",
				map_id: "3055291"
			},
			{
				mod_id: "HD2",
				map_id: "165532"
			},
			{
				mod_id: "HD3",
				map_id: "2443187"
			},
			{
				mod_id: "HR1",
				map_id: "380012"
			},
			{
				mod_id: "HR2",
				map_id: "29294"
			},
			{
				mod_id: "HR3",
				map_id: "894051"
			},
			{
				mod_id: "DT1",
				map_id: "443272"
			},
			{
				mod_id: "DT2",
				map_id: "50316"
			},
			{
				mod_id: "DT3",
				map_id: "791322"
			},
			{
				mod_id: "EZ1",
				map_id: "2239032"
			},
			{
				mod_id: "TB1",
				map_id: "809513"
			}
		]
	}
]

async function main() {
	var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
	html += `<title>why does this even need to exist</title><link rel="stylesheet" type="text/css" href="./index.css"></head><body>`
	html += `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Rajdhani&display=swap" rel="stylesheet">`

	for (let i = 0; i < p_objects.length; i++) {
		let playlist = p_objects[i]
		html += `<div class="playlist"><div class="playlist_name">Playlist ${playlist.name}</div>`

		for (let e = 0; e < playlist.maps.length; e++) {
			let map = playlist.maps[e]
			let map_data = await get("get_beatmaps", `b=${map.map_id}`, `${playlist.name}'s ${map.mod_id}`)
			map_data = map_data[0]

			html += `<a href="https://osu.ppy.sh/b/${map.map_id}" target="_blank" class="beatmap ${map.mod_id.substr(0, 2)}">`
			html += `<img class="map_banner" src="https://assets.ppy.sh/beatmaps/${map_data.beatmapset_id}/covers/cover.jpg" alt="no banner available ><'">`
			html += `<div class="map_mod_id">${map.mod_id}</div>`
			html += `<div class="map_name">${map_data.artist} - ${map_data.title} [${map_data.version}]</div>`
			html += "</a>"
		}

		html += "</div>"
	}

	html += '<img src="https://cdn.discordapp.com/attachments/823624428734251089/904849388034215946/letsalllovealt.gif"></body></html>'
	fs.writeFile(output, html, function(err) {
		if (err) {throw err}
		console.log("\nThe webpage has been built successfully!")
	})
}

main()
