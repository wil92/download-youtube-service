alert("Hello from your Chrome extension!")
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            console.log(window.location.href);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("ok");
                }
            };
            xhttp.open("POST", "http://localhost:4004/download", true);
            xhttp.send(JSON.stringify({link: window.location.href}));
        }
    }
);
