function effect(button) {
	if (!button.classList.contains("active")) {

		let buttons = getSiblings(button)
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove("active")
		}
		button.classList.add("active")

		if (document.getElementById("sheet_presentation")) {document.getElementById("sheet_presentation").remove()}
		var sheet_presentation = document.createElement("div")
		sheet_presentation.id = "sheet_presentation"
		var link_to_sheet = document.createElement("a")
		link_to_sheet.target = "_blank"
		var stuff_to_add = [createText("h2", button.innerHTML)]

		switch(button.id) {
			case "btn_qualifs_1":
				link_to_sheet.href = "https://docs.google.com/spreadsheets/d/1PzYa94TuyWP812z11BRSFSdHHWn6o9GEBeBYx8ZbfOE/edit?usp=sharing"
				stuff_to_add.push(createText("p",
					"This template allows you to easily and quickly setup a referee sheet for your 1v1 tournament's qualifiers!"))
				stuff_to_add.push(createImage("./images/qualifs_1/settings.jpg"))
				stuff_to_add.push(createText("p",
					"You only need to deal with the settings in order for the sheet to work properly!"))
				stuff_to_add.push(createImage("./images/qualifs_1/lobbies.jpg"))
				stuff_to_add.push(createText("p",
					"Give your lobbies IDs, then copy them and paste them into the script in order to create tabs automatically!"))
				break
			case "btn_calculations_1":
				link_to_sheet.href = "https://docs.google.com/spreadsheets/d/1AV8IM6LdCBlKCUjTKcOJgd-MDvLt83isY_PlJHFs9M0/edit?usp=sharing"
				stuff_to_add.push(createText("p",
					"This is a modified version of IceDynamix's Qualifier Template, featuring an alternative way to get the players' user IDs, which are required for calculation"))
				stuff_to_add.push(createText("p",
					`That "alternative way" basically gets the user IDs from "rich text", the type of text that shows a link once hovered on, for example 
					main sheets of tournaments usually feature a player list where player names can be found, and you can access their profile thanks to the rich text!`))
				stuff_to_add.push(createText("p",
					`However, player lists usually never feature user IDs, which are needed for calculating qualifiers results,
					which is why I've created this!`))

				let example = document.createElement("a")
				example.href = "https://docs.google.com/spreadsheets/d/1m6X8In7nmnmvNdqRbHYs-1lSptj4yf607DhKtkxfP9Q/edit?usp=sharing"
				example.appendChild(createText("p", "Example of how it would be used, here for Tomori Cup 2"))
				stuff_to_add.push(example)

				stuff_to_add.push(createText("p",
					`Put shortly, it allows anyone to calculate the results of qualifiers at any time, so players don't have to wait for hosts/sheeters 
					to release them!`))
				break
			default:
				sheet_presentation.appendChild(createText("h2", "nExt"))
				document.getElementById("sheet_selector").insertAdjacentElement("afterend", sheet_presentation)
				return
		}
		
		link_to_sheet.appendChild(createText("p", "Link to the template"))
		stuff_to_add.push(link_to_sheet)
		stuff_to_add.forEach(function(element) {sheet_presentation.appendChild(element)})
		document.getElementById("sheet_selector").insertAdjacentElement("afterend", sheet_presentation)
	}
}

function getSiblings(e) {
	let siblings = []
	if (!e.parentNode) return siblings

	let sibling  = e.parentNode.firstChild
	while (sibling) {
		if (sibling.nodeType === 1 && sibling !== e) {
			siblings.push(sibling)
		}
		sibling = sibling.nextSibling
	}

	return siblings
}

function createText(type, inner) {
	var element = document.createElement(type)
	element.innerHTML = inner
	return element
}

function createImage(path) {
	var element = document.createElement("img")
	element.src = path
	return element
}
