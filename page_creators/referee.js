// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE PAGE_CREATORS FOLDER

require("dotenv").config()
const fs = require("fs")
const input = "../referee/reffing_experience.json"
const output = "../referee/index.html"

const get = require("./functions/get.js")
const error_handler = require("./functions/error_handler.js")
const new_flag_url_sucks = require("./functions/new_flag_url_sucks.js")

// If `fast_mode` is set on false, the script will make 2 or 3 requests per second
// If `fast_mode` is set on true, the script will make **a whole lot more**
fast_mode = false

class Tournament {
	constructor(name, forum, schedule, matches, banner) {
		this.name = name
		this.forum = forum
		this.schedule = schedule.map(s_date => {
			let date = new Date(s_date)
			let a = [date.getFullYear(), date.getMonth()+1, date.getDate()]
			a.forEach(function(b, c) {if (b.toString().length < 2) {a[c] = `0${b}`}})
			return `${a[0]}-${a[1]}-${a[2]}`
		})
		this.matches = matches
		this.banner = banner
	}
}

async function addTournament(name, forum, schedule, mp_ids, banner) {
	console.log("\n")

	let matches = []
	if (fast_mode) {
		matches = await Promise.all(await mp_ids.map(async mp_id => await addMatch(name, mp_id)))
	} else {
		for (let i = 0; i < mp_ids.length; i++) {
			matches.push(await addMatch(name, mp_ids[i]))
		}
	}
	return new Tournament(name, forum, schedule, matches, banner)
}

class Match {
	constructor(name, id, players, schedule) {
		this.name = name
		this.link = `https://osu.ppy.sh/community/matches/${id}`
		this.players = players
		this.schedule = schedule.substring(0, 10)
	}
}

async function addMatch(name, mp_id) {
	let match = await get("get_match", `mp=${mp_id}`, name)
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

	let players = []
	if (fast_mode) {
		players = await Promise.all(await players_ids.map(async player_id => await addPlayer(player_id, match.match.name).catch(e => error_handler(e))))
	} else {
		for (let i = 0; i < players_ids.length; i++) {players.push(await addPlayer(players_ids[i], match.match.name).catch(e => error_handler(e)))}
	}
	return new Match(match.match.name, match.match.match_id, players, start)
}

class Player {
	constructor(id, name, flag_id, rank) {
		this.id = id
		this.name = name
		this.flag = `https://osuflags.omkserver.nl/${flag_id}.png`
		//this.flag = new_flag_url_sucks(flag_id)
		this.rank = rank
	}
}

async function addPlayer(player_id, context) {
	let player = await get("get_user", `u=${player_id}`, context)
	player = player[0]
	return player != undefined ? new Player(player.user_id, player.username, player.country, player.pp_rank) : new Player(player_id, `RESTRICTED_${player_id}`, "CX", Number.MAX_VALUE)
}

async function buildWebpage() {
	const isoDatePattern = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
	let raw_json_file = fs.readFileSync(input)
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
		tournaments.push(await addTournament(tournament.name, tournament.forum, tournament.date, tournament.mp_ids, tournament.banner_url))
	}
	
	for (let i = 0; i < tournaments.length; i++) {
		// Tourney details
		html += `<div class="tournament"><div class="details"><div class="tourney_name"><a href="${tournaments[i].forum}">${tournaments[i].name}</a></div>`
		html += `<div class="schedule">From ${tournaments[i].schedule[0]} to ${tournaments[i].schedule[1]}</div>`
		html += `<div class="number_matches"></div></div><div class="matches">`

		// Tourney matches
		for (let e = 0; e < tournaments[i].matches.length; e++) {
			let match = tournaments[i].matches[e]
			html += `<div class="match"><div class="match_time">${match.schedule}</div>`
			html += `<div class="number_players">${match.players.length} player${match.players.length > 1 ? "s" : ""}</div><div class="match_content">`
			html += `<div class="match_name"><a href="${match.link}">${match.name}</a></div>`
			html += `<div class="match_players">`
			for (let o = 0; o < match.players.length; o++) {
				html += `<div class="player"><img src=${match.players[o].flag}><a href="https://osu.ppy.sh/users/${match.players[o].id}" title=${match.players[o].rank}>${match.players[o].name}</a></div>`
				if (o+1 != match.players.length) {html += " | "}
			}
			html += "</div></div></div>"
		}
		html += "</div>"
		if (tournaments[i].banner) {html += `<img class="banner" src="images/${tournaments[i].banner}">`}
		html += "</div>"
	}

	html += `<footer id="return"><a href="../"><p>Return to main page</p></a></footer>`
	html += "</body></html>"
	fs.writeFile(output, html, function(err) {
		if (err) {throw err}
		console.log("\nThe webpage has been built successfully!")
	})
}

var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
html += '<title>Matches reffed by Taevas</title><link rel="stylesheet" type="text/css" href="./index.css"><script type="text/javascript" src="./search.js"></script><script type="text/javascript" src="./show_stats.js"></script></head><body onload="search(``)"><header><h1>Matches reffed by Taevas</h1></header>'
html += '<input type="text" class="search" placeholder="Look for a player..." oninput="search(this.value.toLowerCase())"><p id="number_results"></p><button type="button" id="show_stats" onclick="show_stats()">Show Stats</button><button type="button" id="hide_stats" onclick="hide_stats()">Hide Stats</button>'

buildWebpage(html)
