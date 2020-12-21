#!/usr/bin/env sh

curl -Lo /usr/local/bin/youtube-dl https://yt-dl.org/downloads/latest/youtube-dl
curl -Lo youtube-dl.sig https://yt-dl.org/downloads/latest/youtube-dl.sig
gpg --keyserver keyserver.ubuntu.com --recv-keys '7D33D762FD6C35130481347FDB4B54CBA4826A18'
gpg --keyserver keyserver.ubuntu.com --recv-keys 'ED7F5BF46B3BBED81C87368E2C393E0F18A9236D'
gpg --verify youtube-dl.sig /usr/local/bin/youtube-dl
chmod a+rx /usr/local/bin/youtube-dl
