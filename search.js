function search(str) {
	let number_results = 0
	var sort_method

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

	if (document.getElementById("sort_by")) {
		if (document.getElementById("appearances").checked) {sort_method = "appearances"}
		else if (document.getElementById("ranks").checked) {sort_method = "ranks"}
	} else {
		sort_method = "appearances"
	}

	resetStats(matches, 10, 10, sort_method)
}

class Player {
	constructor(name, flag, link, rank) {
		this.name = name
		this.flag = flag
		this.link = link
		this.rank = rank
		this.appearances = 1
	}
}

class Flag {
	constructor(name, appearances) {
		this.name = name
		this.appearances = 1
	}
}

function resetStats(matches, max_players, max_flags, sort_method) {
	let nrf = document.getElementById("number_results")
	nrf.textContent += " " // lol
	nrf.textContent = nrf.textContent.substring(0, nrf.textContent.substring(5).indexOf(" ") + 5)

	let old_display = null
	if (document.getElementById("statistics_wrapper")) {
		old_display = document.getElementById("statistics_wrapper").style.display
		document.getElementById("statistics_wrapper").remove()
	}

	var statistics_wrapper = document.createElement("div")
	statistics_wrapper.id = "statistics_wrapper"

	var max_results = document.createElement("form")
	max_results.id = "max_results"

	let label_max_results = document.createElement("label")
	let text_label_max_results = document.createTextNode("Max number of results:")
	label_max_results.appendChild(text_label_max_results)
	max_results.appendChild(label_max_results)

	let max_results_field = document.createElement("input")
	max_results_field.setAttribute("type", "number")
	max_results_field.setAttribute("value", max_players)
	max_results_field.setAttribute("onblur", `resetStats(document.getElementsByClassName("match"), Number(this.value), Number(this.value),
		document.getElementById("appearances").checked ? "appearances" : "ranks")`) // I'll figure out better code, search.js needs a rewrite
	max_results_field.id = "max_results_field"
	max_results.appendChild(max_results_field)

	statistics_wrapper.appendChild(max_results)

	var sort_by = document.createElement("div")
	sort_by.id = "sort_by"

	let label_sort_by = document.createElement("label")
	let text_label_sort_by = document.createTextNode("Sort players by:")
	label_sort_by.appendChild(text_label_sort_by)
	sort_by.appendChild(label_sort_by)

	let sort_by_field = document.createElement("form")

	let sort_by_one = document.createElement("input")
	sort_by_one.setAttribute("type", "radio")
	sort_by_one.setAttribute("id", "appearances")
	sort_by_one.setAttribute("name", "sort")
	sort_by_one.setAttribute("onclick", `resetStats(document.getElementsByClassName("match"), Number(max_results_field.value), Number(max_results_field.value),
		document.getElementById("appearances").checked ? "appearances" : "ranks")`) // I'll figure out better code, search.js needs a rewrite
	if (sort_method == "appearances") {sort_by_one.setAttribute("checked", true)}
	sort_by_field.appendChild(sort_by_one)

	let label_sort_by_one = document.createElement("label")
	label_sort_by_one.setAttribute("for", "appearances")
	let text_label_sort_by_one = document.createTextNode("Appearances")
	label_sort_by_one.appendChild(text_label_sort_by_one)
	sort_by_field.appendChild(label_sort_by_one)

	let sort_by_two = document.createElement("input")
	sort_by_two.setAttribute("type", "radio")
	sort_by_two.setAttribute("id", "ranks")
	sort_by_two.setAttribute("name", "sort")
	sort_by_two.setAttribute("onclick", `resetStats(document.getElementsByClassName("match"), Number(max_results_field.value), Number(max_results_field.value),
		document.getElementById("appearances").checked ? "appearances" : "ranks")`) // I'll figure out better code, search.js needs a rewrite
	if (sort_method == "ranks") {sort_by_two.setAttribute("checked", true)}
	sort_by_field.appendChild(sort_by_two)

	let label_sort_by_two = document.createElement("label")
	label_sort_by_two.setAttribute("for", "ranks")
	let text_label_sort_by_two = document.createTextNode("osu! Ranks")
	label_sort_by_two.appendChild(text_label_sort_by_two)
	sort_by_field.appendChild(label_sort_by_two)

	sort_by.appendChild(sort_by_field)
	statistics_wrapper.appendChild(sort_by)

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
				if (to_add) {players.push(new Player(match_players[e].innerHTML, matches[i].getElementsByClassName("match_players")[0].getElementsByTagName("img")[e].src, match_players[e].href, match_players[e].title))}
			}
		}
	}

	if (sort_method == "appearances") {players.sort((player1, player2) => player2.appearances - player1.appearances)}
	else if (sort_method == "ranks") {players.sort((player1, player2) => player1.rank - player2.rank)}

	document.getElementById("number_results").textContent += ` and ${players.length} player${players.length > 1 ? "s" : ""}`

	limit = players.length <= max_players ? players.length : max_players
	for (let i = 0; i < limit; i++) {
		let row = document.createElement("div")
		row.className = "row"
		row.innerHTML = `${i+1}: <img src=${players[i].flag}><a href=${players[i].link} title=${players[i].rank}>${players[i].name}</a> | ${players[i].appearances} match${players[i].appearances > 1 ? "es" : ""}`
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
	document.getElementById("number_results").textContent += ` across ${flags.length} ${flags.length > 1 ? "countries" : "country"}`

	limit = flags.length <= max_flags ? flags.length : max_flags
	for (let i = 0; i < limit; i++) {
		let row = document.createElement("div")
		row.className = "row"
		row.innerHTML = `${i+1}: <img src=${flags[i].name}>${flags[i].name.substring(32, 34)} | ${flags[i].appearances} player${flags[i].appearances > 1 ? "s" : ""}`
		flag_appearances.appendChild(row)
	}

	statistics.appendChild(flag_appearances)
	statistics_wrapper.appendChild(statistics)

	document.body.insertBefore(statistics_wrapper, document.getElementsByClassName("search")[0])
	if (old_display != null) {document.getElementById("statistics_wrapper").style.display = old_display}
}
