function show_stats() {
	if (document.getElementById("statistics")) {document.getElementById("statistics").style.display = "flex"}
	document.getElementById("show_stats").style.display = "none"
	document.getElementById("hide_stats").style.display = "inline"
}

function hide_stats() {
	if (document.getElementById("statistics")) {document.getElementById("statistics").style.display = "none"}
	document.getElementById("show_stats").style.display = "inline"
	document.getElementById("hide_stats").style.display = "none"
}
