// THIS FILE ALLOWS AN EASIER CREATION OF THE TOURNAMENTS.JSON FILE
// BEFORE SEPTEMBER 2021, TOURNAMENTS WERE ONLY REPRESENTED AS JAVASCRIPT OBJECTS WITHIN FILLER.JS
// AS THEY ARE NOW REPRESENTED SLIGHTLY DIFFERENTLY IN TOURNAMENTS.JSON, THIS ALLOWS AN EASIER TRANSITION

const fs = require('fs')
const file_name = "tournaments.json" // probably shouldn't change it unless you change it in filler.js too

const tournaments = [ //[name, forum, schedule (old) date (new), mp_ids]
	["Orange's Mini Tournament February 2021", "https://osu.ppy.sh/community/forums/topics/1235710", [new Date(2021, 1, 13), new Date(2021, 2, 21)],
	[75671429, 75753901, 75793866, 76242916, 76814194, 76912215, 77366307, 78592434]],

	["Pas de Nom 2v2 Tournament", "https://osu.ppy.sh/community/forums/topics/1239289", [new Date(2021, 1, 27), new Date(2021, 3, 11)],
	[76823379, 76861011, 76906277, 77409232, 77416464, 77454683, 77487179, 78067665, 78067630, 78479937, 78600780, 78657516, 78666437, 79936788]],

	["Fooooooood's Hangry Tournament 2", "https://osu.ppy.sh/community/forums/topics/1222132", [new Date(2021, 1, 20), new Date(2021, 3, 11)],
	[77963157, 77978800, 77978733, 78055481, 78059530, 78072041, 78689305, 78735932, 79221048, 79308377, 79309171]],

	["Osu! Tournament 1 (TIER 1)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 3, 25)],
	[78514204, 78768259, 79318056, 79339405, 79877379, 79937869, 79943073, 79955524, 80580537, 80608443, 81186276]],

	["Osu! Tournament 1 (TIER 2)", "https://osu.ppy.sh/community/forums/topics/1258192", [new Date(2021, 2, 20), new Date(2021, 4, 1)],
	[78513180, 78615645, 78618985, 78692074, 79303835, 79317324, 79844339, 79849442, 79946482, 79962520, 79973768, 80467449, 80512103, 80512148,
	81037578, 81186624, 81667185, 82273027]],

	["Miyu's Flower Run 2021", "https://osu.ppy.sh/community/forums/topics/1261786", [new Date(2021, 3, 10), new Date(2021, 4, 30)],
	[80466676, 80561256, 80567323, 80575071, 81076238, 81087809, 81087857, 81098822, 81119664, 81171482, 81595155, 81595188, 81673733, 81680736,
	81756133, 81758533, 82278694, 82318642, 82528114, 82760546, 82800070, 82867107, 82887600, 83323407, 83561974]],

	["osu! Malaysia Amateur Tournament 2nd Edition", "https://osu.ppy.sh/community/forums/topics/1247275", [new Date(2021, 2, 5), new Date(2021, 3, 25)],
	[80465632, 80476682, 80563350, 81088133, 81181496, 81253559, 81679597]],

	["Irish Circle Clicking Tournament 3", "https://osu.ppy.sh/community/forums/topics/1266363", [new Date(2021, 3, 17), new Date(2021, 3, 24)],
	[81026037]],

	["ReadyUp, Game, Win! April Blitz", "https://osu.ppy.sh/community/forums/topics/1267896", [new Date(2021, 3, 17), new Date(2021, 3, 18)],
	[81096777]],

	["Melody Tournament", "https://osu.ppy.sh/community/forums/topics/1279911", [new Date(2021, 3, 18), new Date(2021, 3, 18)],
	[81205136, 81210349, 81213299]],

	["Triple Trouble II", "https://osu.ppy.sh/community/forums/topics/1295530", [new Date(2021, 3, 30), new Date(2021, 5, 27)],
	[82927626, 82936546, 82936584, 82961866, 83394573, 83483868, 83487536]],

	["Catch French Dual Tournament", "https://osu.ppy.sh/community/forums/topics/1295530", [new Date(2021, 4, 8), new Date(2021, 5, 5)],
	[83401025, 83477551, 83480808, 83484015, 83956893, 84975189]],

	["Epic Fumo Tournament 1", "https://osu.ppy.sh/community/forums/topics/1303398", [new Date(2021, 4, 8), new Date(2021, 6, 6)],
	[82836658, 82850037, 82887292, 82923218, 82927562, 82940037, 82965284, 83962031, 83963219, 84550232, 84615199, 85042304]],

	["osu!mania Malaysia Tournament", "https://osu.ppy.sh/community/forums/topics/1301065", [new Date(2021, 4, 14), new Date(2021, 5, 27)],
	[84553995, 84556681]],

	["Unicornlover's Scuffed Osu Tournament", "https://osu.ppy.sh/community/forums/topics/1312008", [new Date(2021, 4, 28), new Date(2021, 6, 17)],
	[85439410, 85878346, 86303510]],

	["WhiteCat Official Osu! Tournament Low Tier", "https://osu.ppy.sh/community/forums/topics/1298947", [new Date(2021, 4, 15), new Date(2021, 6, 11)],
	[83477371, 83477438, 84518793, 84565637, 84569132, 85046268, 85048839, 85122411, 85877270]],

	["WhiteCat Official Osu! Tournament Mid Tier", "https://osu.ppy.sh/community/forums/topics/1298947", [new Date(2021, 4, 29), new Date(2021, 6, 18)],
	[84567139, 84906677, 84907634, 85041110]],

	["finnish duo cup", "https://osu.ppy.sh/community/forums/topics/1313956", [new Date(2021, 4, 28), new Date(2021, 6, 31)],
	[84562646, 84565561, 84569390]],

	["SEA Summer Suiji Showdown", "https://osu.ppy.sh/community/forums/topics/1306172", [new Date(2021, 4, 29), new Date(2021, 6, 11)],
	[84968081, 85878215, 86303018, 86364088, 86369581, 86710511]],

	["La provençale 2021", "https://osu.ppy.sh/community/forums/topics/1313094", [new Date(2021, 5, 5), new Date(2021, 6, 11)],
	[85940842, 86893128]],

	["osu!Malaysia Tournament 2021", "https://osu.ppy.sh/community/forums/topics/1311342", [new Date(2021, 5, 5), new Date(2021, 6, 25)],
	[84975240, 84978259, 85046069, 85048991, 85367477, 85367550, 85373945, 85374022, 85436469]],

	["South African osu! Tournament 3", "https://osu.ppy.sh/community/forums/topics/1293423", [new Date(2021, 5, 11), new Date(2021, 6, 24)],
	[85365151, 85403449, 85436437, 85439172, 85529600, 85532044, 86654625, 86713598, 86713608]],

	["5 Digit Joker Cup", "https://osu.ppy.sh/community/forums/topics/1309821", [new Date(2021, 5, 11), new Date(2021, 7, 18)],
	[85501268, 85512213, 85512301, 86006107, 86006124, 86655106, 86721037, 86721039, 86721452]],

	["Nightmare's Basic Tourney", "https://osu.ppy.sh/community/forums/topics/1328880", [new Date(2021, 6, 9), new Date(2021, 7, 22)],
	[87989572, 88037613]],

	["Koro's Back 2 Skool Tournament", "https://osu.ppy.sh/community/forums/topics/1337953", [new Date(2021, 6, 17), new Date(2021, 7, 28)],
	[87612933, 87641253, 88036252, 88036259, 88084230, 88396306, 88396317, 88396339, 88414457, 88417129, 88451881, 89357151, 89561902]],

	["osu! Romania Summer Tournament 2021", "https://osu.ppy.sh/community/forums/topics/1300582", [new Date(2021, 6, 20), new Date(2021, 8, 7)],
	[87735546, 87750966, 87812622]],

	["Dials Scuffed Summer Cup", "https://osu.ppy.sh/community/forums/topics/1364452", [new Date(2021, 7, 13), new Date(2021, 9, 3)],
	[89248805, 89252658, 89277944, 89302528, 89307789, 89561191, 89610540, 89614270, 89614560, 89635598, 89671299, 89671303, 89694267, 89694271,
	89954228, 89969024, 90076245]]
]

let json = {
	tournaments: []
}

function convertDate(date) {return JSON.stringify(date).replace(/"/g, "")}

tournaments.forEach(tournament => {
	let obj = {
		name: tournament[0],
		forum: tournament[1],
		date: [convertDate(tournament[2][0]), convertDate(tournament[2][1])],
		mp_ids: tournament[3]
	}

	json.tournaments.push(obj)
	console.log(`Converted ${obj.name}`)
})

fs.writeFile(file_name, JSON.stringify(json, null, 4), "utf8", (err) => {
	err ? console.error(err) : console.log(`File "${file_name}" created!`)
})
