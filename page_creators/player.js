// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE PAGE_CREATORS FOLDER

require("dotenv").config()
const fs = require("fs")
const input = "../player/playing_experience.json"
const output = "../player/index.html"

const get = require("./functions/get.js")
const error_handler = require("./functions/error_handler.js")
const new_flag_url_sucks = require("./functions/new_flag_url_sucks.js")

// If `fast_mode` is set on false, the script will make 2 or 3 requests per second
// If `fast_mode` is set on true, the script will make **a whole lot more**
fast_mode = false

class Tournament {
	constructor(name, forum, gamemode, team, seed, placing, matches, banner) {
		this.name = name
		this.forum = forum
		this.gamemode = gamemode === 0 ? "osu!" : gamemode === 1 ? "taiko" : gamemode === 2 ? "ctb" : "mania"
		this.team = team
		this.seed = seed
		this.placing = placing
		this.matches = matches
		this.banner = banner
	}
}

async function addTournament(name, forum, gamemode, team, seed, placing, matches, banner, main_player) {
	console.log("\n")

	let matches_arr = []
	let teammates = [main_player]
	if (team) {team.members.forEach(mate => teammates.push(mate))}

	let team_object = team ? {"name": team.name, "members": await Promise.all(await team.members.map(async player_id => await addPlayer(player_id, name).catch(e => error_handler(e))))} : team // team is false so false

	if (fast_mode) {
		matches_arr = await Promise.all(await matches.map(async match => await addMatch(name, match.id, match.results, teammates)))
	} else {
		for (let i = 0; i < matches.length; i++) {
			matches_arr.push(await addMatch(name, matches[i].id, matches[i].results, teammates))
		}
	}

	return new Tournament(name, forum, gamemode, team_object, seed, placing, matches_arr, banner)
}

class Match {
	constructor(name, id, players, results, start) {
		this.name = name
		this.link = `https://osu.ppy.sh/community/matches/${id}`
		this.players = players
		this.results = results
		this.schedule = start.substring(0, 10)
	}
}

async function addMatch(name, mp_id, results, team) {
	let match = await get("get_match", `mp=${mp_id}`, name)
	let start = match.games[0].start_time
	
	let players_ids = []

	for (let i = 0; i < match.games.length; i++) {
		for (let e = 0; e < match.games[i].scores.length; e++) {
			let already_in = false
			for (let o = 0; o < players_ids.length; o++) {
				if (players_ids[o] == match.games[i].scores[e].user_id || match.games[i].scores[e].score == "0") {already_in = true}
			}
			if (!already_in) {players_ids.push(Number(match.games[i].scores[e].user_id))}
		}
	}

	let players = []
	if (fast_mode) {
		players = await Promise.all(await players_ids.map(async player_id => {
			if (team.indexOf(player_id) === -1) {await addPlayer(player_id, match.match.name).catch(e => error_handler(e))}
		}))
	} else {
		for (let i = 0; i < players_ids.length; i++) {if (team.indexOf(players_ids[i]) === -1) {
			players.push(await addPlayer(players_ids[i], match.match.name).catch(e => error_handler(e)))
		}}
	}

	return new Match(match.match.name, match.match.match_id, players, results, start)
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
	return player != undefined ? new Player(player.user_id, player.username, player.country, player.pp_rank) : new Player(player_id, "BANNED_USER", "CX", Number.MAX_VALUE)
}

async function buildWebpage() {
	let raw_json_file = fs.readFileSync(input)
	let json_file = JSON.parse(raw_json_file)
	let json_tournaments = json_file.tournaments

	let tournaments = []

	for (let i = 0; i < json_tournaments.length; i++) {
		let tournament = json_tournaments[i]
		tournaments.push(await addTournament(tournament.name, tournament.forum, tournament.gamemode, tournament.team, tournament.seed, tournament.placing, tournament.matches, tournament.banner_url, json_file.player))
	}
	
	for (let i = 0; i < tournaments.length; i++) {
		// Tourney details
		html = html + `<div class="tournament"><div class="details"><a class="tourney_name" href="${tournaments[i].forum}">${tournaments[i].name}</a>`
		html = html + `<div class="info"><p class="gamemode">Gamemode: ${tournaments[i].gamemode}</p><p class="seed">Seed: ${tournaments[i].seed}</p><p class="placing">Finished: ${tournaments[i].placing}</p></div>`

		if (tournaments[i].team) {
			html = html + `<div class="team"><div class="team_name_div"><p>As</p><p class="team_name">${tournaments[i].team.name}</p><p>with:</p></div><div class="players">`
			for (let o = 0; o < tournaments[i].team.members.length; o++) {
				html = html + `<div class="player"><img src=${tournaments[i].team.members[o].flag}><a href="https://osu.ppy.sh/users/${tournaments[i].team.members[o].id}" title=${tournaments[i].team.members[o].rank}>${tournaments[i].team.members[o].name}</a></div>`
			}
			html = html + "</div></div>"
		}

		html = html + `</div><div class="matches">`

		// Tourney matches
		for (let e = 0; e < tournaments[i].matches.length; e++) {
			let match = tournaments[i].matches[e]

			html = html + `<div class="match${!tournaments[i].matches[e].results ? " qualifier" : ""}">`//<div class="match_time">${match.schedule}</div>` // ???
			// html = html + `<div class="number_players">${match.players.length} player${match.players.length > 1 ? "s" : ""}</div>` // ???
			html = html + `<a class="match_name" href="${match.link}">${match.name}</a>`

			if (match.results) {
				html = html + `<div class="info ${match.results.wins > match.results.losses ? "win" : "loss"}">`
				html = html + `<p>${match.results.wins > match.results.losses ? "Won" : "Lost"} ${match.results.wins}-${match.results.losses}</p></div>`
			}

			html = html + `<div class="players">`
			for (let o = 0; o < match.players.length; o++) {
				html = html + `<div class="player"><img src=${match.players[o].flag}><a href="https://osu.ppy.sh/users/${match.players[o].id}" title=${match.players[o].rank}>${match.players[o].name}</a></div>`
				if (o+1 != match.players.length) {html = html + " | "} /// ????
			}
			html = html + "</div></div>"
		}
		html = html + "</div>"
		if (tournaments[i].banner) {html = html + `<img class="banner" src="images/${tournaments[i].banner}">`}
		html = html + "</div>"
	}

	html = html + `<footer id="return"><a href="../"><p>Return to main page</p></a></footer>`
	html = html + "</body></html>"
	fs.writeFile(output, html, function(err) {
		if (err) {throw err}
		console.log("\nThe webpage has been built successfully!")
	})
}

var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
html = html + `<title>Taevas' tournament history</title><link rel="stylesheet" type="text/css" href="./index.css"></head><body><header><h1>Taevas' tournament history</h1></header>`

buildWebpage(html)
