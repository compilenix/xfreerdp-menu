# Notes
Using this tool "exposes" your passwords to local users, because the password will be visable within the commandline.

# Requirements
- nodejs 12+
- xfreerdp 2
  - Ubuntu: `freerdp2-x11`
  - fedora: either of
    - `https://raw.githubusercontent.com/compilenix/dotfiles/master/home/bin_dotfiles/build-xfreerdp.sh`
    - dnf package `xfreerdp` or `freerdp-2:2.0.0`
- dmenu
- `base64`

# Installation
```bash
git clone https://git.compilenix.org/compilenix/xfreerdp-menu.git
cd xfreerdp-menu
npm ci
sudo ln -sfv xfreerdp-menu.sh /usr/bin/rdp-menu
sudo ln -sfv xfreerdp-dmenu.sh /usr/bin/rdp-dmenu
cp -v config.example.json "$HOME/.config/xfreerdp/config.json"
$EDITOR "$HOME/.config/xfreerdp/config.json"
```
# Config Reference
## Floatbar
One of:
- always
- fullscreen
- window

## ExecutableOverwride (optional)
Use this specific xfreerdp executable instead of `xfreerdp`.

## DefaultWindowSize (optional)
### w (optional)
The custom window weight in pixel.

### h (optional)
The custom window height in prixel.

## DisableSound (optional)
set to `true` if you want to disable sound redirection to your client.

## Session
### Name
Displayname of the RDP Session.

### HostName
The DNS Hostname or host ip address.

### Port (optional)
The RDP TCP port of the server.

### Domain
The Domain to logon to. If you want to perform a local user logon use "`.`" (without the quotes).

### User
The local or domain username.

### Password
The base64 encoded password.

Create with: `echo "password" | base64`

### Fullscreen (optional)
Set to `true` if you want to start the session in fullscreen.

### Network (optional)
One of:
- modem
- broadband
- broadband-low
- broadband-high
- wan
- lan
- auto

### Compression (optional)
One of:
- 0
- 1
- 2

Which level does what isn't documented by FreeRDP, so im guessing that `2` enables the strongest compression.

### Admin (optional)
Admin (or console) session.
