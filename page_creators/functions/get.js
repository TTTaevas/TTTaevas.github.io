module.exports = async function get(type, additional, context) {
	console.log(`REQUESTING ${type} ${additional} | BECAUSE ${context}`)
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
	.catch((e) => {throw e})

	return resp.data
}
