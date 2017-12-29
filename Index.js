const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Menu = require("terminal-menu");

/** @type {any[]} */
var sessions = require(os.homedir() + "/.config/xfreerdp/config.json");
sessions.sort((a, b) => {
    if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
    if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1;
    return 0;
});

const menu = Menu({ width: 80 });
menu.reset();
menu.write("RDP Sessions\n");
menu.write("-------------------------\n");

for (let index = 0; index < sessions.length; index++) {
    menu.add(sessions[index].Name);
}

menu.on("select", async label => {
    let session = sessions.find(value => value.Name.toLowerCase() === label.toLowerCase());
    if (!session) return;
    menu.close();
    if (session.Port) session.HostName += `:${session.Port}`;
    let command = `xfreerdp /u:${session.User} /d:${session.Domain} /v:${session.HostName} +clipboard /rfx /rfx-mode:video /sound:sys:alsa /async-update /async-input +fonts +aero /audio-mode:0 /frame-ack:1 +window-drag +decorations /network:lan -encryption /cert-ignore`;
    if (session.Fullscreen) command += " /f";
    console.log(`${session.Domain}\\${session.User}@${session.HostName}`);
    await exec(command);
});
process.stdin.pipe(menu.createStream()).pipe(process.stdout);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

menu.on("close", () => {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.end();
});
