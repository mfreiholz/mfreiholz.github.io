const MAIL_REVERSE = "ed.zlohierfm@ofni"
const PHONE_REVERSE = "67507028 671 )0( 94+"

function scrollToElement(elementId, event) {
	if (event) {
		event.preventDefault()
	}
	let element = document.getElementById(elementId)
	element.scrollIntoView({ behavior: 'smooth' })
}

function reverseString(str) {
	let s = ""
	for (let i = str.length - 1; i >= 0; --i) {
		s += str[i]
	}
	return s
}

// Hire-Me Button.
let hireMeButton = jQuery("#hire-me-btn")
if (hireMeButton) {
	hireMeButton.on("click", function(e) {
		const mail = reverseString(MAIL_REVERSE)
		const subj = "Website Contact"
		document.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent(subj)
	})
}

// Fill mail.
let eMail = jQuery(".contact-info dd.email")
if (eMail) {
	eMail.html(reverseString(MAIL_REVERSE))
}

// Fill phone.
let ePhone = jQuery(".contact-info dd.phone")
if (ePhone) {
	ePhone.html(reverseString(PHONE_REVERSE))
}

let pageTopButton = document.getElementById("scrolltop")
if (pageTopButton) {
	pageTopButton.addEventListener("click", function(e) {
		scrollToElement("site-body", e)
	})
}



// let hireMeButton = document.getElementById("hire-me-btn")
// if (hireMeButton) {
// 	hireMeButton.addEventListener("click", function(e) {
// 		e.preventDefault()
// 		scrollToElement("contact-form-section", e)
// 	})
// }

/*
 * Contact Form
 */
/*
let contactForm = document.getElementById("contact-form")
if (contactForm) {
	jQuery("#human-verification-button").on("click", function(event) {
		jQuery.ajax({
			url: "http://localhost:3000/human-verify",
			data: {
				formId: "ASDF",
			},
			dataType: "json",
			success: function (result) {
				
			}
		})
	})
	let humanButton = document.getElementById("human-verification-button")
	let humanVerificationField = document.getElementById("human-verification-code-input")
	console.log("OK!")
} else {
	console.log("NOT OK!")
}*/