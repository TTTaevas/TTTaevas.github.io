// DON'T FORGET TO PUT IN YOUR API KEY IN A .env FILE IN THE FILLER FOLDER
// THE FIRST HALF OF THE buildWebpage FUNCTION IS THE ONLY THING YOU NEED TO CHANGE HERE

require('dotenv').config()
const fs = require('fs')

var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Matches reffed by Taevas</title><link rel="stylesheet" type="text/css" href="./index.css"></head><body><header><h1>Matches reffed by Taevas</h1></header>'
tournaments = []

class Tournament {
	constructor(name, forum, schedule, matches) {
		this.name = name
		this.forum = forum
		this.schedule = schedule
		this.matches = matches
	}
}

class Match {
	constructor(name, id, players, start) {
		this.name = name
		this.link = `https://osu.ppy.sh/community/matches/${id}`
		this.players = players
		this.start = start
	}
}

class Player {
	constructor(id, name, flag) {
		this.id = id
		this.name = name
		this.flag = `https://osu.ppy.sh/images/flags/${flag}.png`
	}
}

buildWebpage(html)

async function buildWebpage() {

	// CHANGE DETAILS BELOW
	var matches = [75671429, 75753901, 75793866, 76242916, 76814194, 76912215, 77366307, 78592434]
	await addTournament("Orange's Mini Tournament February 2021", "https://osu.ppy.sh/community/forums/topics/1235710", [new Date(2021, 1, 13), new Date(2021, 2, 21)], matches)
	
	var matches = [76823379, 76861011, 76906277, 77409232, 77416464, 77454683, 77487179, 78067665, 78067630, 78479937, 78600780, 78657516, 78666437, 79936788]
	await addTournament("Pas de Nom 2v2 Tournament", "https://osu.ppy.sh/community/forums/topics/1239289", [new Date(2021, 1, 27), new Date(2021, 3, 11)], matches)
	
	var matches = [77963157, 77978800, 77978733, 78055481, 78059530, 78072041, 78689305, 78735932, 79221048, 79308377, 79309171]
	await addTournament("Fooooooood's Hangry Tournament 2", "https://osu.ppy.sh/community/forums/topics/1222132", [new Date(2021, 1, 20), new Date(2021, 3, 11)], matches)

	var matches = [78514204, 78768259, 79318056, 79339405, 79877379, 79937869, 79943073, 79955524, 80580537, 80608443]
	await addTournament("Osu! Tournament 1 (TIER 1)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 3, 25)], matches)
	
	var matches = [78513180, 78615645, 78618985, 78692074, 79303835, 79317324, 79844339, 79849442, 79946482, 79962520, 79973768, 80467449, 80512103, 80512148]
	await addTournament("Osu! Tournament 1 (TIER 2)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 3, 25)], matches)
	
	var matches = [80466676, 80561256, 80567323, 80575071]
	await addTournament("Miyu's Flower Run 2021", "https://osu.ppy.sh/community/forums/topics/1261786", [new Date(2021, 3, 10), new Date(2021, 4, 22)], matches)
	
	var matches = [80465632, 80476682, 80563350]
	await addTournament("osu! Malaysia Amateur Tournament 2nd Edition ", "https://osu.ppy.sh/community/forums/topics/1247275", [new Date(2021, 2, 5), new Date(2021, 3, 25)], matches)
	// CHANGE DETAILS ABOVE
	
	for (let i = 0; i < tournaments.length; i++) {
		// Beginning and details
		html = html + `<div class="tournament"><div class="details"><div class="tourney_name"><a href="${tournaments[i].forum}">${tournaments[i].name}</a></div>`
		html = html + `<div class="schedule">${tournaments[i].schedule[0].getMonth()+1}/${tournaments[i].schedule[0].getDate()}/${tournaments[i].schedule[0].getFullYear()} - ${tournaments[i].schedule[1].getMonth()+1}/${tournaments[i].schedule[1].getDate()}/${tournaments[i].schedule[1].getFullYear()}</div>`
		html = html + `<div class="number_matches">Reffed ${tournaments[i].matches.length} matches</div></div><div class="matches">`

		// Matches and end
		for (let e = 0; e < tournaments[i].matches.length; e++) {
			let match = tournaments[i].matches[e]

			html = html + `<div class="match"><div class="match_time">${match.start.substring(0, 10)}</div>`
			html = html + `<div class="match_name"><a href="${match.link}">${match.name}</a></div>`
			html = html + `<div class="number_players">${match.players.length} player${match.players.length > 1 ? "s" : ""}</div><div class="match_players">`
			for (let o = 0; o < match.players.length; o++) {
				html = html + `<img src=${match.players[o].flag}><a href="https://osu.ppy.sh/users/${match.players[o].id}">${match.players[o].name}</a>`
				if (o+1 != match.players.length) {html = html + " | "}
			}
			html = html + "</div></div>"
		}
		html = html + "</div></div>"
	}

	html = html + "</body></html>"
	fs.writeFile("../index.html", html, function(err) {
		if (err) {throw err}
		console.log("The webpage has been built successfully!")
	})
}

async function addTournament(name, forum, schedule, matches) {
	console.log(`\n\nGetting the data needed for ${name}...`)
	let proper_matches = []
	for (let i = 0; i < matches.length; i++) {
		console.log(`\nMatch ${i+1}:`)
		let match = await get("get_match", `mp=${matches[i]}`)
		let start = match.games[0].start_time

		let players = []
		for (let e = 0; e < match.games.length; e++) {
			for (let o = 0; o < match.games[e].scores.length; o++) {
				let already_in = false
				for (let a = 0; a < players.length; a++) {
					if (players[a] == match.games[e].scores[o].user_id || match.games[e].scores[o].score == "0") {already_in = true}
				}
				if (!already_in) {players.push(match.games[e].scores[o].user_id)}
			}
		}

		for (let e = 0; e < players.length; e++) {
			let player = await get("get_user", `u=${players[e]}`)
			player = player[0]
			players[e] = new Player(player.user_id, player.username, player.country)
		}
		
		proper_matches.push(new Match(match.match.name, match.match.match_id, players, start))
	}

	tournaments.push(new Tournament(name, forum, schedule, proper_matches))
}

async function get(type, additional) {
	console.log(`https://osu.ppy.sh/api/${type}?${additional}`) ///&k=${process.env.osu_api_key}`)
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
