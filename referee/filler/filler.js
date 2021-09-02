// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE FILLER FOLDER

require('dotenv').config()
const fs = require('fs')
counter = 0
fast_mode = false

// If `fast_mode` is set on false, the script will make 2 or 3 requests per second
// If `fast_mode` is set on true, the script will make **a whole lot more**

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
	constructor(id, name, flag_id, rank) {
		this.id = id
		this.name = name
		this.flag = `https://osuflags.omkserver.nl/${flag_id}.png`
		//this.flag = newFlagUrlSucks(flag_id)
		this.rank = rank
	}
}

function newFlagUrlSucks(flag_id) {
	let beauty = "https://osu.ppy.sh/assets/images/flags/"
	for (let i = 0; i < flag_id.length; i++) {
		beauty += (flag_id.charCodeAt(i) + 127397).toString(16)
		if (i != flag_id.length - 1) {
			beauty += "-"
		} else {
			beauty += ".svg"
		}
	}
	return beauty
}

async function buildWebpage() {
	const isoDatePattern = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
	let raw_json_file = fs.readFileSync("tournaments.json")
	let json_file = JSON.parse(raw_json_file, (key, value) => {
		// This code converts Strings like "2021-02-12T23:00:00.000Z" (isostrings) to Date objects
		if (typeof value === "string" && value.match(isoDatePattern)) {
			return new Date(value)
		}
		return value
	})
	let json_tournaments = json_file.tournaments

	let tournaments = []

	for (let i = 0; i < json_tournaments.length; i++) {
		let tournament = json_tournaments[i]
		tournaments.push(await addTournament(tournament.name, tournament.forum, tournament.date, tournament.mp_ids))
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

	html = html + `<footer id="return"><a href="../"><p>Return to main page</p></a></footer>`
	html = html + "</body></html>"
	fs.writeFile("../index.html", html, function(err) {
		if (err) {throw err}
		console.log("The webpage has been built successfully!")
	})
}

async function addTournament(name, forum, schedule, mp_ids) {
	console.log(`\n${name}: GETTING MATCHES`)
	let matches = []
	if (fast_mode) {
		matches = await Promise.all(await mp_ids.map(async mp_id => await addMatch(name, mp_id)))
	} else {
		for (let i = 0; i < mp_ids.length; i++) {
			matches.push(await addMatch(name, mp_ids[i]))
		}
	}
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
	let players = []
	if (fast_mode) {
		players = await Promise.all(await players_ids.map(async player_id => await addPlayer(player_id).catch((e) => {
			console.log("An error happened: ", e)
			if (e.response && e.response.status == 429) {
				console.log("ENDING THE SCRIPT: TOO MANY REQUESTS")
				process.exit(1)
			}
		})))
	} else {
		for (let i = 0; i < players_ids.length; i++) {
			players.push(await addPlayer(players_ids[i]).catch((e) => {
				console.log("An error happened: ", e)
				if (e.response && e.response.status == 429) {
					console.log("ENDING THE SCRIPT: TOO MANY REQUESTS")
					process.exit(1)
				}
			}))
		}
	}
	return new Match(match.match.name, match.match.match_id, players, start)
}

async function addPlayer(player_id) {
	if (!fast_mode) {console.log(`(${counter}) GETTING PLAYER ${player_id}`)}
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
