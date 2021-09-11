module.exports = function error_handler(e) {
	console.log("An error happened: ", e)
	if (e.response && e.response.status == 429) {
		console.log("ENDING THE SCRIPT: TOO MANY REQUESTS")
		process.exit(1)
	}
}
