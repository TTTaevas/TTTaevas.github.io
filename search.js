function search(str) {
	let number_results = 0

	let matches = document.getElementsByClassName("match")
	for (let i = 0; i < matches.length; i++) {
		let to_hide = true

		let players = matches[i].getElementsByClassName("match_players")[0].getElementsByTagName("a")
		for (let e = 0; e < players.length; e++) {
			if (players[e].innerHTML.toLowerCase().includes(str)) {to_hide = false}
		}
		
		if (!to_hide) {number_results++}
		matches[i].style.display = to_hide ? "none" : "block"
	}

	let tournaments = document.getElementsByClassName("tournament")
	for (let i = 0; i < tournaments.length; i++) {
		let matches_shown = 0
		let to_hide = true

		let tournament_matches = tournaments[i].getElementsByClassName("matches")[0].getElementsByClassName("match")
		for (let e = 0; e < tournament_matches.length; e++) {
			if (tournament_matches[e].style.display != "none") {
				matches_shown++
				to_hide = false
			}
		}

		tournaments[i].getElementsByClassName("number_matches")[0].textContent = `${tournaments[i].getElementsByClassName("match").length} match${tournaments[i].getElementsByClassName("match").length > 1 ? "es" : ""}`
		tournaments[i].getElementsByClassName("number_matches")[0].textContent += ` (${matches_shown} shown)`
				
		tournaments[i].style.display = to_hide ? "none" : "block"
	}
	
	document.getElementById("number_results").textContent = `${number_results} match${number_results > 1 ? "es" : ""}`

	resetStats(matches)
}

class Player {
	constructor(name, flag, link) {
		this.name = name
		this.flag = flag
		this.link = link
		this.appearances = 1
	}
}

class Flag {
	constructor(name, appearances) {
		this.name = name
		this.appearances = 1
	}
}

function resetStats(matches) {
	let old_display = null
	if (document.getElementById("statistics")) {
		old_display = document.getElementById("statistics").style.display
		document.getElementById("statistics").remove()
	}

	var limit
	var statistics = document.createElement("div")
	statistics.id = "statistics"

	let players = []
	let player_appearances = document.createElement("div")
	player_appearances.id = "player_appearances"

	for (let i = 0; i < matches.length; i++) {
		if (matches[i].style.display != "none") {
			let match_players = matches[i].getElementsByClassName("match_players")[0].getElementsByTagName("a")
			for (let e = 0; e < match_players.length; e++) {
				let to_add = true
				for (let o = 0; o < players.length; o++) {
					if (match_players[e].href == players[o].link) {
						to_add = false
						players[o].appearances++
					}
				}
				if (to_add) {players.push(new Player(match_players[e].innerHTML, matches[i].getElementsByClassName("match_players")[0].getElementsByTagName("img")[e].src, match_players[e].href))}
			}
		}
	}

	players.sort((player1, player2) => player2.appearances - player1.appearances)
	document.getElementById("number_results").textContent += ` and ${players.length} player${players.length > 1 ? "s" : ""}`

	limit = players.length <= 10 ? players.length : 10
	for (let i = 0; i < limit; i++) {
		let row = document.createElement("div")
		row.className = "row"
		row.innerHTML = `${i+1}: <img src=${players[i].flag}><a href=${players[i].link}>${players[i].name}</a> | ${players[i].appearances} match${players[i].appearances > 1 ? "es" : ""}`
		player_appearances.appendChild(row)
	}

	statistics.appendChild(player_appearances)

	let flags = []
	let flag_appearances = document.createElement("div")
	flag_appearances.id = "flag_appearances"

	for (let i = 0; i < players.length; i++) {
		let to_add = true
		for (let e = 0; e < flags.length; e++) {
			if (players[i].flag == flags[e].name) {
				to_add = false
				flags[e].appearances++
			}
		}
		if (to_add) {flags.push(new Flag(players[i].flag))}
	}

	flags.sort((flag1, flag2) => flag2.appearances - flag1.appearances)

	limit = flags.length <= 10 ? flags.length : 10 
	for (let i = 0; i < limit; i++) {
		let row = document.createElement("div")
		row.className = "row"
		row.innerHTML = `${i+1}: <img src=${flags[i].name}>${flags[i].name.substring(32, 34)} | ${flags[i].appearances} player${flags[i].appearances > 1 ? "s" : ""}`
		flag_appearances.appendChild(row)
	}

	statistics.appendChild(flag_appearances)

	document.body.insertBefore(statistics, document.getElementsByClassName("search")[0])
	if (old_display != null) {document.getElementById("statistics").style.display = old_display}
}
