// const { get } = require('sortablejs')
const { remote } = window.require('electron')
const fs = window.require('fs')
const path = window.require('path')

const appPath = path.dirname(remote.app.getPath('exe'))
const configPath = path.join(appPath, 'config')
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath)
}
const CONFIG_PATH = path.join(configPath, '/conf.d')
if (!fs.existsSync(CONFIG_PATH)) {
  const defaultConfig = {}
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig))
}

const utils = {
  appPath,
  get(key) {
    let confData = fs.readFileSync(CONFIG_PATH)
    confData = confData.toString()
    confData = confData || '{}'
    const conf = JSON.parse(confData)

    if (conf.hasOwnProperty(key)) {
      return conf[key]
    }
    return undefined
  },

  set(key, value) {
    let confData = fs.readFileSync(CONFIG_PATH)
    confData = confData.toString()
    confData = confData || '{}'
    const conf = JSON.parse(confData)

    conf[key] = value
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf))
  },

  remove(key) {
    let confData = fs.readFileSync(CONFIG_PATH)
    confData = confData.toString()
    confData = confData || '{}'
    const conf = JSON.parse(confData)

    if (conf.hasOwnProperty(key)) {
      conf[key] = null
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf))
  }
}

module.exports = utils
