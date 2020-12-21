const http = require('http');

const BASE_HTTP_PAGE = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Download App</title>
    </head>
    <body>
        <div style="text-align: center">
            <input id="link" name="link" type="text" style="width: 350px;font-size: 1.5rem;"/>
            <button id="send" style="font-size: 1.5rem;">send</button>
        <div>
        <script>
            var link = document.getElementById("link");
            var send = document.getElementById("send");

            function sendLink() {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log("ok");
                    }
                };
                xhttp.open("POST", "download", true);
                xhttp.send(JSON.stringify({link: link.value}));
            }

            (function () {
                link.onkeyup = function(e) {
                    if(e.which === 13) {
                        sendLink();
                        link.value = "";
                    }
                };
                send.onclick = function() {
                    sendLink();
                    link.value = "";
                };
            })();
        </script>
    </body>
</html>
`;

let downloadPromise = Promise.resolve();

function downloadYoutubeVideo(link, options = '') {
    const {exec} = require("child_process");
    return new Promise((resolve, reject) => {
        exec(`youtube-dl ${options} ${link}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
}

const requestListener = function (req, res) {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(BASE_HTTP_PAGE);
    } else if (req.method === 'POST' && req.url === '/download') {
        (new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => {
                if (chunk) {
                    body += chunk.toString();
                }
            });
            req.on('end', () => resolve(JSON.parse(body)));
        })).then((data) => {
            if (data && data.link) {
                downloadPromise = downloadPromise
                    .catch(console.error)
                    .then(() => downloadYoutubeVideo(data.link));
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.writeHead(200);
            res.end("{success: 'ok'}");
        });
    }
}

const server = http.createServer(requestListener);
server.listen(8000);
