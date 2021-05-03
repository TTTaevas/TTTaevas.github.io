// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE FILLER FOLDER
// THE FIRST HALF OF THE buildWebpage FUNCTION IS THE ONLY THING YOU NEED TO CHANGE HERE

require('dotenv').config()
const fs = require('fs')
counter = 0

class Tournament {
	constructor(name, forum, schedule, matches) {
		this.name = name
		this.forum = forum
		this.schedule = schedule
		this.matches = matches
	}
}

class Match {
	constructor(name, id, players, schedule) {
		this.name = name
		this.link = `https://osu.ppy.sh/community/matches/${id}`
		this.players = players
		this.schedule = `${schedule.substring(5, 7)}/${schedule.substring(8, 10)}/${schedule.substring(0, 4)}`
	}
}

class Player {
	constructor(id, name, flag) {
		this.id = id
		this.name = name
		this.flag = `https://osu.ppy.sh/images/flags/${flag}.png`
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
		[78513180, 78615645, 78618985, 78692074, 79303835, 79317324, 79844339, 79849442, 79946482, 79962520, 79973768, 80467449, 80512103, 80512148, 81037578, 81186624, 81667185, 82273027]],

		["Miyu's Flower Run 2021", "https://osu.ppy.sh/community/forums/topics/1261786", [new Date(2021, 3, 10), new Date(2021, 4, 29)],
		[80466676, 80561256, 80567323, 80575071, 81076238, 81087809, 81087857, 81098822, 81119664, 81171482, 81595155, 81595188, 81673733, 81680736, 81756133, 81758533, 82278694, 82318642]],

		["osu! Malaysia Amateur Tournament 2nd Edition", "https://osu.ppy.sh/community/forums/topics/1247275", [new Date(2021, 2, 5), new Date(2021, 3, 25)],
		[80465632, 80476682, 80563350, 81088133, 81181496, 81253559, 81679597]],

		["Irish Circle Clicking Tournament 3", "https://osu.ppy.sh/community/forums/topics/1266363", [new Date(2021, 3, 17), new Date(2021, 3, 24)],
		[81026037]],

		["ReadyUp, Game, Win! April Blitz", "https://osu.ppy.sh/community/forums/topics/1267896", [new Date(2021, 3, 17), new Date(2021, 3, 18)],
		[81096777]],

		["Melody Tournament", "https://osu.ppy.sh/community/forums/topics/1279911", [new Date(2021, 3, 18), new Date(2021, 3, 18)],
		[81205136, 81210349, 81213299]]

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
		html = html + `<div class="schedule">${tournaments[i].schedule[0].getMonth()+1}/${tournaments[i].schedule[0].getDate()}/${tournaments[i].schedule[0].getFullYear()} - ${tournaments[i].schedule[1].getMonth()+1}/${tournaments[i].schedule[1].getDate()}/${tournaments[i].schedule[1].getFullYear()}</div>`
		html = html + `<div class="number_matches"></div></div><div class="matches">`

		// Tourney matches
		for (let e = 0; e < tournaments[i].matches.length; e++) {
			let match = tournaments[i].matches[e]

			html = html + `<div class="match"><div class="match_time">${match.schedule}</div>`
			html = html + `<div class="number_players">${match.players.length} player${match.players.length > 1 ? "s" : ""}</div><div class="match_content">`
			html = html + `<div class="match_name"><a href="${match.link}">${match.name}</a></div>`
			html = html + `<div class="match_players">`
			for (let o = 0; o < match.players.length; o++) {
				html = html + `<img src=${match.players[o].flag}><a href="https://osu.ppy.sh/users/${match.players[o].id}">${match.players[o].name}</a>`
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
	const players = await Promise.all(await players_ids.map(async player_id => await addPlayer(player_id)))
	return new Match(match.match.name, match.match.match_id, players, start)
}

async function addPlayer(player_id) {
	let player = await get("get_user", `u=${player_id}`)
	player = player[0]
	return new Player(player.user_id, player.username, player.country)
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
	
	return resp.data
}

var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
html = html + '<title>Matches reffed by Taevas</title><link rel="stylesheet" type="text/css" href="./index.css"><script type="text/javascript" src="./search.js"></script><script type="text/javascript" src="./show_stats.js"></script></head><body onload="search(``)"><header><h1>Matches reffed by Taevas</h1></header>'
html = html + '<input type="text" class="search" placeholder="Look for a player..." oninput="search(this.value.toLowerCase())"><p id="number_results"></p><button type="button" id="show_stats" onclick="show_stats()">Show Stats</button><button type="button" id="hide_stats" onclick="hide_stats()">Hide Stats</button>'

buildWebpage(html)
