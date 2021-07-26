// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE FILLER FOLDER
// THE FIRST HALF OF THE buildWebpage FUNCTION IS THE ONLY THING YOU NEED TO CHANGE HERE

require('dotenv').config()
const fs = require('fs')
counter = 0

class Tournament {
	constructor(name, forum, schedule, matches) {
		this.name = name
		this.forum = forum
		this.schedule = schedule.map(date => {
			let a = [date.getFullYear(), date.getMonth()+1, date.getDate()]
			a.forEach(function(b, c) {if (b.toString().length < 2) {a[c] = `0${b}`}})
			return `${a[0]}-${a[1]}-${a[2]}`
		})
		this.matches = matches
	}
}

class Match {
	constructor(name, id, players, schedule) {
		this.name = name
		this.link = `https://osu.ppy.sh/community/matches/${id}`
		this.players = players
		this.schedule = schedule.substring(0, 10)
	}
}

class Player {
	constructor(id, name, flag, rank) {
		this.id = id
		this.name = name
		this.flag = `https://osu.ppy.sh/images/flags/${flag}.png`
		this.rank = rank
	}
}

async function buildWebpage() {

	// CHANGE DETAILS BELOW
	let new_tournaments = [ // [name, forum, schedule, mp_links]

		["Orange's Mini Tournament February 2021", "https://osu.ppy.sh/community/forums/topics/1235710", [new Date(2021, 1, 13), new Date(2021, 2, 21)],
		[75671429, 75753901, 75793866, 76242916, 76814194, 76912215, 77366307, 78592434]],

		["Pas de Nom 2v2 Tournament", "https://osu.ppy.sh/community/forums/topics/1239289", [new Date(2021, 1, 27), new Date(2021, 3, 11)],
		[76823379, 76861011, 76906277, 77409232, 77416464, 77454683, 77487179, 78067665, 78067630, 78479937, 78600780, 78657516, 78666437, 79936788]],

		["Fooooooood's Hangry Tournament 2", "https://osu.ppy.sh/community/forums/topics/1222132", [new Date(2021, 1, 20), new Date(2021, 3, 11)],
		[77963157, 77978800, 77978733, 78055481, 78059530, 78072041, 78689305, 78735932, 79221048, 79308377, 79309171]],

		["Osu! Tournament 1 (TIER 1)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 3, 25)],
		[78514204, 78768259, 79318056, 79339405, 79877379, 79937869, 79943073, 79955524, 80580537, 80608443, 81186276]],

		["Osu! Tournament 1 (TIER 2)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 4, 1)],
		[78513180, 78615645, 78618985, 78692074, 79303835, 79317324, 79844339, 79849442, 79946482, 79962520, 79973768, 80467449, 80512103, 80512148,
		81037578, 81186624, 81667185, 82273027]],

		["Miyu's Flower Run 2021", "https://osu.ppy.sh/community/forums/topics/1261786", [new Date(2021, 3, 10), new Date(2021, 4, 30)],
		[80466676, 80561256, 80567323, 80575071, 81076238, 81087809, 81087857, 81098822, 81119664, 81171482, 81595155, 81595188, 81673733, 81680736,
		81756133, 81758533, 82278694, 82318642, 82528114, 82760546, 82800070, 82867107, 82887600, 83323407, 83561974]],

		["osu! Malaysia Amateur Tournament 2nd Edition", "https://osu.ppy.sh/community/forums/topics/1247275", [new Date(2021, 2, 5), new Date(2021, 3, 25)],
		[80465632, 80476682, 80563350, 81088133, 81181496, 81253559, 81679597]],

		["Irish Circle Clicking Tournament 3", "https://osu.ppy.sh/community/forums/topics/1266363", [new Date(2021, 3, 17), new Date(2021, 3, 24)],
		[81026037]],

		["ReadyUp, Game, Win! April Blitz", "https://osu.ppy.sh/community/forums/topics/1267896", [new Date(2021, 3, 17), new Date(2021, 3, 18)],
		[81096777]],

		["Melody Tournament", "https://osu.ppy.sh/community/forums/topics/1279911", [new Date(2021, 3, 18), new Date(2021, 3, 18)],
		[81205136, 81210349, 81213299]],

		["Triple Trouble II", "https://osu.ppy.sh/community/forums/topics/1295530", [new Date(2021, 3, 30), new Date(2021, 5, 27)],
		[82927626, 82936546, 82936584, 82961866, 83394573, 83483868, 83487536]],

		["Catch French Dual Tournament", "https://osu.ppy.sh/community/forums/topics/1295530", [new Date(2021, 4, 8), new Date(2021, 5, 5)],
		[83401025, 83477551, 83480808, 83484015, 83956893, 84975189]],

		["Epic Fumo Tournament 1", "https://osu.ppy.sh/community/forums/topics/1303398", [new Date(2021, 4, 8), new Date(2021, 6, 6)],
		[82836658, 82850037, 82887292, 82923218, 82927562, 82940037, 82965284, 83962031, 83963219, 84550232, 84615199, 85042304]],

		["osu!mania Malaysia Tournament", "https://osu.ppy.sh/community/forums/topics/1301065", [new Date(2021, 4, 14), new Date(2021, 5, 27)],
		[84553995, 84556681]],

		["Unicornlover's Scuffed Osu Tournament", "https://osu.ppy.sh/community/forums/topics/1312008", [new Date(2021, 4, 28), new Date(2021, 6, 17)],
		[85439410, 85878346, 86303510]],

		["WhiteCat Official Osu! Tournament Low Tier", "https://osu.ppy.sh/community/forums/topics/1298947", [new Date(2021, 4, 15), new Date(2021, 6, 11)],
		[83477371, 83477438, 84518793, 84565637, 84569132, 85046268, 85048839, 85122411, 85877270]],

		["WhiteCat Official Osu! Tournament Mid Tier", "https://osu.ppy.sh/community/forums/topics/1298947", [new Date(2021, 4, 29), new Date(2021, 6, 18)],
		[84567139, 84906677, 84907634, 85041110]],

		["finnish duo cup", "https://osu.ppy.sh/community/forums/topics/1313956", [new Date(2021, 4, 28), new Date(2021, 7, 1)], // ???????
		[84562646, 84565561, 84569390]],

		["SEA Summer Suiji Showdown", "https://osu.ppy.sh/community/forums/topics/1306172", [new Date(2021, 4, 29), new Date(2021, 6, 11)],
		[84968081, 85878215, 86303018, 86364088, 86369581, 86710511]],

		["La provençale 2021", "https://osu.ppy.sh/community/forums/topics/1313094", [new Date(2021, 5, 5), new Date(2021, 6, 11)],
		[85940842, 86893128]],

		["osu!Malaysia Tournament 2021", "https://osu.ppy.sh/community/forums/topics/1311342", [new Date(2021, 5, 5), new Date(2021, 6, 25)],
		[84975240, 84978259, 85046069, 85048991, 85367477, 85367550, 85373945, 85374022, 85436469]],

		["South African osu! Tournament 3", "https://osu.ppy.sh/community/forums/topics/1293423", [new Date(2021, 5, 11), new Date(2021, 6, 24)],
		[85365151, 85403449, 85436437, 85439172, 85529600, 85532044, 86654625, 86713598, 86713608]],

		["5 Digit Joker Cup", "https://osu.ppy.sh/community/forums/topics/1309821", [new Date(2021, 5, 11), new Date(2021, 7, 18)],
		[85501268, 85512213, 85512301, 86006107, 86006124, 86655106, 86721037, 86721039, 86721452]],

		["Nightmare's Basic Tourney", "https://osu.ppy.sh/community/forums/topics/1328880", [new Date(2021, 6, 9), new Date(2021, 7, 22)],
		[87989572, 88037613]],

		["osu!catch Battle Royale Tournament", "https://osu.ppy.sh/community/forums/topics/1319593", [new Date(2021, 6, 10), new Date(2021, 7, 1)], // Will end before I could ref anything
		[]],

		["Koro's Back 2 Skool Tournament", "https://osu.ppy.sh/community/forums/topics/1337953", [new Date(2021, 6, 17), new Date(2021, 7, 28)],
		[87612933, 87641253, 88036252, 88036259, 88084230]],

		["osu! Romania Summer Tournament 2021", "https://osu.ppy.sh/community/forums/topics/1300582", [new Date(2021, 6, 20), new Date(2021, 8, 7)],
		[87735546, 87750966, 87812622]],

	]
	// CHANGE DETAILS ABOVE

	let tournaments = []

	for (let i = 0; i < new_tournaments.length; i++) {
		let tournament = new_tournaments[i]
		tournaments.push(await addTournament(tournament[0], tournament[1], tournament[2], tournament[3]))
	}
	
	for (let i = 0; i < tournaments.length; i++) {
		// Tourney details
		html = html + `<div class="tournament"><div class="details"><div class="tourney_name"><a href="${tournaments[i].forum}">${tournaments[i].name}</a></div>`
		html = html + `<div class="schedule">From ${tournaments[i].schedule[0]} to ${tournaments[i].schedule[1]}</div>`
		html = html + `<div class="number_matches"></div></div><div class="matches">`

		// Tourney matches
		for (let e = 0; e < tournaments[i].matches.length; e++) {
			let match = tournaments[i].matches[e]

			html = html + `<div class="match"><div class="match_time">${match.schedule}</div>`
			html = html + `<div class="number_players">${match.players.length} player${match.players.length > 1 ? "s" : ""}</div><div class="match_content">`
			html = html + `<div class="match_name"><a href="${match.link}">${match.name}</a></div>`
			html = html + `<div class="match_players">`
			for (let o = 0; o < match.players.length; o++) {
				html = html + `<div class="player"><img src=${match.players[o].flag}><a href="https://osu.ppy.sh/users/${match.players[o].id}" title=${match.players[o].rank}>${match.players[o].name}</a></div>`
				if (o+1 != match.players.length) {html = html + " | "}
			}
			html = html + "</div></div></div>"
		}
		html = html + "</div></div>"
	}

	html = html + "</body></html>"
	fs.writeFile("../index.html", html, function(err) {
		if (err) {throw err}
		console.log("The webpage has been built successfully!")
	})
}

async function addTournament(name, forum, schedule, mp_ids) {
	console.log(`\n${name}: GETTING MATCHES`)
	const matches = await Promise.all(await mp_ids.map(async mp_id => await addMatch(name, mp_id)))
	console.log(`${name}: FINISHED\n`)
	return new Tournament(name, forum, schedule, matches)
}

async function addMatch(name, mp_id) {
	let match = await get("get_match", `mp=${mp_id}`)
	let start = match.games[0].start_time
	
	let players_ids = []
	for (let i = 0; i < match.games.length; i++) {
		for (let e = 0; e < match.games[i].scores.length; e++) {
			let already_in = false
			for (let o = 0; o < players_ids.length; o++) {
				if (players_ids[o] == match.games[i].scores[e].user_id || match.games[i].scores[e].score == "0") {already_in = true}
			}
			if (!already_in) {players_ids.push(match.games[i].scores[e].user_id)}
		}
	}
	console.log(`(${counter}) ${name}: GETTING PLAYERS FOR MATCH ${mp_id}`)
	const players = await Promise.all(await players_ids.map(async player_id => await addPlayer(player_id).catch((e) => console.log("An error happened: ", e))))
	return new Match(match.match.name, match.match.match_id, players, start)
}

async function addPlayer(player_id) {
	let player = await get("get_user", `u=${player_id}`)
	player = player[0]
	return player != undefined ? new Player(player.user_id, player.username, player.country, player.pp_rank) : new Player(player_id, "BANNED_USER", "CX", Number.MAX_VALUE)
}

async function get(type, additional) {
	counter++
	const axios = require("axios")
	const resp = await axios({
		method: "get",
		baseURL: "https://osu.ppy.sh/api/",
		url: `/${type}?${additional}&k=${process.env.osu_api_key}`,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		}
	})
	.catch((e) => {throw e})
	
	return resp.data
}

var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
html = html + '<title>Matches reffed by Taevas</title><link rel="stylesheet" type="text/css" href="./index.css"><script type="text/javascript" src="./search.js"></script><script type="text/javascript" src="./show_stats.js"></script></head><body onload="search(``)"><header><h1>Matches reffed by Taevas</h1></header>'
html = html + '<input type="text" class="search" placeholder="Look for a player..." oninput="search(this.value.toLowerCase())"><p id="number_results"></p><button type="button" id="show_stats" onclick="show_stats()">Show Stats</button><button type="button" id="hide_stats" onclick="hide_stats()">Hide Stats</button>'

buildWebpage(html)
