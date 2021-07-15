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
				stuff_to_add.push(createText("p",
					"This template allows you to easily and quickly setup a referee sheet for your 1v1 tournament's qualifiers!"))
				stuff_to_add.push(createImage("./images/qualifs_1/settings.jpg"))
				stuff_to_add.push(createText("p",
					"You only need to deal with the settings in order for the sheet to work properly!"))
				stuff_to_add.push(createImage("./images/qualifs_1/lobbies.jpg"))
				stuff_to_add.push(createText("p",
					"Give your lobbies IDs, then copy them and paste them into the script in order to create tabs automatically!"))
				link_to_sheet.href = "https://docs.google.com/spreadsheets/d/1PzYa94TuyWP812z11BRSFSdHHWn6o9GEBeBYx8ZbfOE/edit?usp=sharing"
				break
			default:
				sheet_presentation.appendChild(createText("h2", "nExt"))
				document.body.appendChild(sheet_presentation)
				return
		}
		
		link_to_sheet.appendChild(createText("p", "Link to the template"))
		stuff_to_add.push(link_to_sheet)
		stuff_to_add.forEach(function(element) {sheet_presentation.appendChild(element)})
		document.body.appendChild(sheet_presentation)
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
