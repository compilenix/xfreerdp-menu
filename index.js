const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const Menu = require('terminal-menu')
const trimNewlines = require('trim-newlines')

/** @type {any[]} */
var sessions = require(os.homedir() + '/.config/xfreerdp/config.json')
sessions.sort((a, b) => {
  if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1
  if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1
  return 0
})

async function run (/** @type {any} */ session) {
  // console.log(session);
  if (session.Port) session.HostName += `:${session.Port}`
  let command = `echo "${session.Password}" | base64 -d | xfreerdp /u:${session.User} /d:${session.Domain} /v:${session.HostName} /from-stdin +clipboard /rfx /rfx-mode:video /sound:sys:alsa /async-update /async-input +fonts +aero /audio-mode:0 /frame-ack:1 +window-drag +decorations /network:lan -encryption /cert-ignore`
  if (session.Fullscreen) command += ' /f'
  console.log(`${session.Domain}\\${session.User}@${session.HostName}`)
  await exec(command)
}

if (process.argv.slice(2).length > 0) {
  switch (process.argv.slice(2)[0]) {
    case 'list':
      for (let index = 0; index < sessions.length; index++) {
        process.stdout.write(`${sessions[index].Name}\n`)
      }
      break
    case 'run':
      run(sessions.find(value => value.Name.toLowerCase() === trimNewlines(process.argv.slice(2)[1].toLowerCase())))
      break
  }
} else {
  const menu = Menu({ width: 80 })
  menu.reset()
  menu.write('RDP Sessions\n')
  menu.write('-------------------------\n')

  for (let index = 0; index < sessions.length; index++) {
    menu.add(sessions[index].Name)
  }

  menu.on('select', async label => {
    const session = sessions.find(value => value.Name.toLowerCase() === label.toLowerCase())
    if (!session) return
    menu.close()
    await run(session)
  })
  process.stdin.pipe(menu.createStream()).pipe(process.stdout)

  if (process.stdin.isTTY) process.stdin.setRawMode(true)

  menu.on('close', () => {
    if (process.stdin.isTTY) process.stdin.setRawMode(false)
    process.stdin.end()
  })
}
