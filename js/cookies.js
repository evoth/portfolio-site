// Sets a cookie with the given name and value (expires in one year)
function setCookie(name, value) {
    const yearFromNow = new Date();
    yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
    let expires = "expires=" + yearFromNow.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Gets the value for the cookie with the given name, returning "" if not found
function getCookie(name) {
    let nameEq = name + "=";
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEq) == 0) {
            return cookie.substring(nameEq.length, cookie.length);
        }
    }
    return "";
}