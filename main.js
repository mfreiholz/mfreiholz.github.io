(() => {
  // <stdin>
  var MAIL_REVERSE = "ed.zlohierfm@ofni";
  var PHONE_REVERSE = "67507028 671 )0( 94+";
  function scrollToElement(elementId, event) {
    if (event) {
      event.preventDefault();
    }
    let element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: "smooth" });
  }
  function reverseString(str) {
    let s = "";
    for (let i = str.length - 1; i >= 0; --i) {
      s += str[i];
    }
    return s;
  }
  var hireMeButton = jQuery("#hire-me-btn");
  if (hireMeButton) {
    hireMeButton.on("click", function(e) {
      const mail = reverseString(MAIL_REVERSE);
      const subj = "Website Contact";
      document.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent(subj);
    });
  }
  var eMail = jQuery(".contact-info dd.email");
  if (eMail) {
    eMail.html(reverseString(MAIL_REVERSE));
  }
  var ePhone = jQuery(".contact-info dd.phone");
  if (ePhone) {
    ePhone.html(reverseString(PHONE_REVERSE));
  }
  var pageTopButton = document.getElementById("scrolltop");
  if (pageTopButton) {
    pageTopButton.addEventListener("click", function(e) {
      scrollToElement("site-body", e);
    });
  }
})();
