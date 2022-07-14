// Loads header and footer, then scrolls to the correct anchor if one is given
// (loading jQuery content on top of scroll position messes it up, hence this approach)
$(window).on('load', function () {
    $("#header").load("/includes/header.html", function () {
        // Scrolls to the correct position when loaded
        if (window.location.hash) {
            $("html, body").scrollTop($(window.location.hash).offset().top);
        } else {
            $("html, body").scrollTop(0);
        };
    });
    $("#footer").load("/includes/footer.html");
});