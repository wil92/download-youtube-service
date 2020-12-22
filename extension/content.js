function downloadVideo(link) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("ok");
        }
    };
    xhttp.open("POST", "http://localhost:4004/download", true);
    xhttp.send(JSON.stringify({link: link}));
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            downloadVideo(window.location.href);
        }
    }
);

const genId = {index: 1, gen: function() {return this.index++;}};

function addDownloadLink() {
    const items = document.getElementsByClassName("yt-simple-endpoint");
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (item.id === 'thumbnail' && !item.hash) {
            item.hash = genId.gen();
            const downloadLink = document.createElement('a');
            downloadLink.style.color = "#fff";
            downloadLink.style.fontSize = "1.5rem";
            downloadLink.style.position = "absolute";
            downloadLink.style.background = "#28a739";
            downloadLink.style.padding = "2px";
            downloadLink.style.cursor = "s-resize";
            downloadLink.innerHTML = "download";
            const href = item.href;
            downloadLink.addEventListener('click', function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                downloadVideo(href);
                downloadLink.style.background = "#a77028";
            });
            item.appendChild(downloadLink);
        }
    }
}

function loop() {
    addDownloadLink();
    setTimeout(loop, 2000);
}

window.onload = function () {
    setTimeout(loop, 2000);
};
