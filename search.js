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
		let to_hide = true

		let tournament_matches = tournaments[i].getElementsByClassName("matches")[0].getElementsByClassName("match")
		for (let e = 0; e < tournament_matches.length; e++) {
			if (tournament_matches[e].style.display != "none") {to_hide = false}
		}
				
		tournaments[i].style.display = to_hide ? "none" : "block"
	}
	console.log(document.getElementById("number_results"))
	document.getElementById("number_results").textContent = `${number_results} match${number_results > 1 ? "es" : ""}`
}
