module.exports = function new_flag_url_sucks(flag_id) {
	let url = "https://osu.ppy.sh/assets/images/flags/"

	for (let i = 0; i < flag_id.length; i++) {
		url += (flag_id.charCodeAt(i) + 127397).toString(16)
		url += i != flag_id.length - 1 ? "-" : ".svg"
	}
	return url
}
