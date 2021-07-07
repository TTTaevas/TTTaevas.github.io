function show_stats() {
	if (document.getElementById("statistics_wrapper")) {document.getElementById("statistics_wrapper").style.display = "block"}
	document.getElementById("show_stats").style.display = "none"
	document.getElementById("hide_stats").style.display = "inline"
}

function hide_stats() {
	if (document.getElementById("statistics_wrapper")) {document.getElementById("statistics_wrapper").style.display = "none"}
	document.getElementById("show_stats").style.display = "inline"
	document.getElementById("hide_stats").style.display = "none"
}
