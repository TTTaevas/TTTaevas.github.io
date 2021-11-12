// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE PAGE_CREATORS FOLDER

require("dotenv").config()
const fs = require("fs")
const output = "../cyberia/index.html"

const get = require("./functions/get.js")
const error_handler = require("./functions/error_handler.js")

p_objects = [
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
	},
	{
		name: "F",
		maps: [
			{
				mod_id: "NM1",
				map_id: "2636342"
			},
			{
				mod_id: "NM2",
				map_id: "757386"
			},
			{
				mod_id: "NM3",
				map_id: "2395972"
			},
			{
				mod_id: "NM4",
				map_id: "2124036"
			},
			{
				mod_id: "NM5",
				map_id: "2538881"
			},
			{
				mod_id: "HD1",
				map_id: "2489781"
			},
			{
				mod_id: "HD2",
				map_id: "105978"
			},
			{
				mod_id: "HD3",
				map_id: "2906707"
			},
			{
				mod_id: "HR1",
				map_id: "87066"
			},
			{
				mod_id: "HR2",
				map_id: "3048988"
			},
			{
				mod_id: "HR3",
				map_id: "2018113"
			},
			{
				mod_id: "DT1",
				map_id: "3030309"
			},
			{
				mod_id: "DT2",
				map_id: "2581223"
			},
			{
				mod_id: "DT3",
				map_id: "773905"
			},
			{
				mod_id: "EZ1",
				map_id: "1863867"
			},
			{
				mod_id: "TB1",
				map_id: "883801"
			}
		]
	}
]

String.prototype.toMMSS = function() {
	var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2)
	var seconds = ("00" + (this % 3600) % 60).slice(-2)
	return minutes + ":" + seconds
}

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

			html += `<div class="map_stats">BPM ${map.mod_id.substr(0, 2) == "DT" ? map_data.bpm * 1.5 : map_data.bpm}</div>`
			html += `<div class="map_stats">`
			var map_cs
			var map_ar
			var map_od
			switch (map.mod_id.substr(0, 2)) {
				case "NM":
				case "HD":
				case "TB":
					html += `Length ${map_data.hit_length.toMMSS()} | CS ${map_data.diff_size} | AR ${map_data.diff_approach} | OD ${map_data.diff_overall}`
					break
				case "HR":
					map_cs = map_data.diff_size * 1.3 > 10 ? 10 : (map_data.diff_size * 1.3).toFixed(1)
					map_ar = map_data.diff_approach * 1.4 > 10 ? 10 : (map_data.diff_approach * 1.4).toFixed(1)
					map_od = map_data.diff_overall * 1.4 > 10 ? 10 : (map_data.diff_overall * 1.4).toFixed(1)
					html += `Length ${map_data.hit_length.toMMSS()} | CS ${map_cs} | AR ${map_ar} | OD ${map_od}`
					break
				case "DT":
					map_ar = (map_data.diff_approach <= 5 ? (1800-((1800-map_data.diff_approach*120)*2/3))/120 : ((1200-((1200-(map_data.diff_approach-5)*150)*2/3))/150)+5).toFixed(1)
					map_od = ((79.5-((79.5-6*map_data.diff_overall)*2/3))/6).toFixed(1)
					//html += `Length ${String(map_data.hit_length / (3 / 2)).toMMSS()} | CS ${map_data.diff_size} | AR ${map_ar} | OD ${map_od}`
					// I guess I'll need to figure out DT length soon
					html += `Length ${map_data.hit_length.toMMSS()} without DT | CS ${map_data.diff_size} | AR ${map_ar} | OD ${map_od}`
					break
				case "EZ":
					html += `Length ${map_data.hit_length.toMMSS()} | CS ${map_data.diff_size / 2} | AR ${map_data.diff_approach / 2} | OD ${map_data.diff_overall / 2}`
					break
			}
			html += "</div>"

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
