const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const Menu = require('terminal-menu')
const trimNewlines = require('trim-newlines')

class DefaultWindowSize {
  constructor () {
    this.w = 0
    this.h = 0
  }
}

class Session {
  constructor () {
    this.Name = ''
    this.HostName = ''
    this.Port = 0
    this.Domain = ''
    this.User = ''
    this.Password = ''
    this.Fullscreen = false
    this.Compression = 0
    this.Network = 'lan'
    this.Admin = false
  }
}

class Config {
  constructor () {
    this.ExecutableOverwride = ''
    this.DefaultWindowSize = new DefaultWindowSize()
    this.DisableSound = false
    this.Floatbar = 'always'

    /** @type {Session[]} */
    this.Sessions = []
  }
}

/** @type {Config} */
const config = Object.assign(new Config(), require(os.homedir() + '/.config/xfreerdp/config.json'))
config.Sessions.sort((a, b) => {
  if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1
  if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1
  return 0
})

async function run (/** @type {Session} */ session) {
  if (session.Port) session.HostName += `:${session.Port}`
  const executable = config.ExecutableOverwride ? config.ExecutableOverwride : 'xfreerdp'

  let command = `echo "${session.Password}" | base64 -d | "${executable}" /u:${session.User} /d:${session.Domain} /v:${session.HostName} /t:"RDP: ${session.Name}" /from-stdin +toggle-fullscreen +auto-reconnect /auto-reconnect-max-retries:20 +drives +home-drive /dynamic-resolution +clipboard /rfx /gdi:hw /video /ipv6 +multitransport +multitouch /geometry +gestures +offscreen-cache /async-update /async-input /frame-ack:1 +fonts /floatbar:sticky:on,default:visible,show:${config.Floatbar} -encryption /cert-ignore`

  if (session.Fullscreen) {
    command += ' /f'
  } else if (config.DefaultWindowSize && config.DefaultWindowSize.w && config.DefaultWindowSize.h) {
    command += ` /w:${config.DefaultWindowSize.w} /h:${config.DefaultWindowSize.h}`
  }

  if (session.Network) {
    if (session.Network === 'wan') {
      command += ` /network:${session.Network} -wallpaper -themes -decorations -aero -menu-anims -window-drag +mouse-motion`
    } else {
      command += ` /network:${session.Network} +mouse-motion`
    }
  } else {
    command += ' /network:lan +wallpaper +themes +decorations +mouse-motion +aero +menu-anims +window-drag'
  }

  if (session.Compression) {
    command += ` +compression /compression-level:${session.Compression}`
  } else {
    command += ' -compression'
  }

  if (config.DisableSound) {
    command += ' /audio-mode:2'
  } else {
    command += ' /audio-mode:0'
  }

  if (session.Admin) command += ' /admin'

  console.log(`${command}`)
  await exec(command)
}

if (process.argv.slice(2).length > 0) {
  switch (process.argv.slice(2)[0]) {
    case 'list':
      for (let index = 0; index < config.Sessions.length; index++) {
        process.stdout.write(`${config.Sessions[index].Name}\n`)
      }
      break
    case 'run':
      run(config.Sessions.find(value => value.Name.toLowerCase() === trimNewlines(process.argv.slice(2)[1].toLowerCase())))
      break
  }
} else {
  const menu = Menu({ width: 80 })
  menu.reset()
  menu.write('RDP Sessions\n')
  menu.write('-------------------------\n')

  for (let index = 0; index < config.Sessions.length; index++) {
    menu.add(config.Sessions[index].Name)
  }

  menu.on('select', async label => {
    const session = config.Sessions.find(value => value.Name.toLowerCase() === label.toLowerCase())
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
