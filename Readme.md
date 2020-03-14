# Notes
Using this tool "exposes" your passwords to local users, because the password will be visable within the commandline!

# Requirements
- nodejs 12+
- `base64`
- xfreerdp
  - Ubuntu: `freerdp2-x11`
- rofi

# Installation
```bash
git clone https://git.compilenix.org/Compilenix/xfreerdp-menu.git
cd xfreerdp-menu.git
npm ci
sudo ln -sfv "$(pwd)/xfreerdp-menu.sh" /usr/bin/
sudo ln -sfv "$(pwd)/xfreerdp-dmenu.sh" /usr/bin/
sudo ln -sfv "$(pwd)/xfreerdp-dmenu.sh" /usr/bin/rdp-dmenu
```
