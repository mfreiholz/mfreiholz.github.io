function scrollToElement(elementId, event) {
	if (event) {
		event.preventDefault()
	}
	let element = document.getElementById(elementId)
	element.scrollIntoView({ behavior: 'smooth' })
}

/* __MAIN__ */

// Fill e-mail.
// ...

// Fill phone.
// ...

let pageTopButton = document.getElementById("scrolltop");
if (pageTopButton) {
	pageTopButton.addEventListener("click", function(e) {
		scrollToElement("site-body", e);
	})
}