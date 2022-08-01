// Help messages
const waitMessage = "Please wait at least 10 minutes between messages.";
const failedMessage = "Failed to send message. Please try again later.";
const invalidEmailMessage = "Please enter a valid email address.";
const blankFieldsMessage = function (blankFieldNames) {
    if (blankFieldNames.length > 1) {
        blankFieldNames[blankFieldNames.length - 1] = "and " + blankFieldNames[blankFieldNames.length - 1];
    }
    let blankFieldsText = blankFieldNames.join(blankFieldNames.length > 2 ? ", " : " ");
    return `Please fill out the ${blankFieldsText} field${blankFieldNames.length == 1 ? "" : "s"}.`;
}
const successMessage = "Thank you for reaching out. I look forward to receiving your message!";

// Initializes EmailJS service
(function () {
    emailjs.init("knV0s-uhPfwHW2jYE");
})();

window.onload = function () {

    const form = document.getElementById("contact-me-form");
    const submitButton = document.getElementById("contact-me-form-submit");
    const helpText = document.getElementById("contact-me-form-help-text");
    let submitted = false;

    // Checks the form whenever we update any of the text or switch focus between fields
    form.querySelectorAll("input, textarea").forEach((e) => {
        e.addEventListener("blur", function () {
            // Marks an input as "touched" when we unfocus an element
            if (e != submitButton) {
                this.classList.add("is-touched");
            }
            validateContactForm();
        }, false);
        e.addEventListener("input", validateContactForm, false);
    });

    // Sends an email if we haven't already done so in the past 10 minutes
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // If there's no cookie indicating a recently sent email, send it and add the cookie. Otherwise, show warning.
        if (getCookie("form") === "") {
            emailjs.sendForm("service_6m1rfsx", "template_408j0ee", this)
                .then(function () {
                    submitted = true;
                    submitButton.setAttribute("value", "Message sent");
                    updateHelpText(successMessage, false);
                    setCookieMinutes("form", "sent", 10);
                    disableFields();
                }, function (error) {
                    submitButton.setAttribute("value", "Failed to send");
                    updateHelpText(failedMessage, true);
                });
        } else {
            submitButton.setAttribute("value", "Wait to send");
            updateHelpText(waitMessage, true);
        }
    });

    // Checks the form for invalid (or blank) fields, generating a warning message when necessary
    function validateContactForm() {

        // We likely got called as the result of the blur event from a field to the submit button.
        if (submitted) {
            return;
        }

        let isEmailValid = true;
        let blankFieldNames = [];

        // Selects all fields that are invalid and have been interacted with (the same ones that are colored red) and
        // keeps track of the names of blank fields, and whether the email is valid
        form.querySelectorAll("input.is-touched:invalid, textarea.is-touched:invalid").forEach((e) => {
            if (e.validity.valueMissing) {
                blankFieldNames.push(e.getAttribute("placeholder"));
            } else if (e.validity.typeMismatch) {
                isEmailValid = false;
            }
        });

        // If all the fields are blank, reset the form
        let numFieldsTouched = form.querySelectorAll("input.is-touched, textarea.is-touched").length;
        if (numFieldsTouched > 0 && blankFieldNames.length == numFieldsTouched) {
            form.querySelectorAll("input, textarea").forEach((e) => {
                e.classList.remove("is-touched");
                updateHelpText("");
            });
            // Some fields have been left blank
        } else if (blankFieldNames.length > 0) {
            updateHelpText(blankFieldsMessage(blankFieldNames), true);
            // Email is invalid (as determined by HTML type validation)
        } else if (!isEmailValid) {
            updateHelpText(invalidEmailMessage, true);
            // No warnings
        } else {
            updateHelpText("");
        }

        // Does a full check of fields, regardless of whether they have been interacted with
        let isFormValid = true;
        form.querySelectorAll("input, textarea").forEach((e) => {
            if (!e.validity.valid) {
                isFormValid = false;
            }
        });

        // Only enables the send button if everything is valid
        submitButton.setAttribute("value", "Send message");
        if (isFormValid) {
            submitButton.removeAttribute("disabled");
        } else {
            submitButton.setAttribute("disabled", "");
        }
    }

    // Updates the help text by the submit button. If danger is true, the text is colored red.
    function updateHelpText(text, danger = false) {
        if (danger) {
            helpText.classList.add("has-text-danger");
        } else {
            helpText.classList.remove("has-text-danger");
        }
        helpText.innerHTML = text;
    }

    // Disables all form fields
    function disableFields() {
        form.querySelectorAll("input, textarea").forEach((e) => {
            e.setAttribute("disabled", "");
        });
    }

    // Auto-expanding textareas
    Array.from(document.getElementsByTagName("textarea")).forEach((e) => {
        e.setAttribute("style", "height: " + (e.scrollHeight) + "px; overflow-y: hidden;");
        e.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        }, false);
    });
}