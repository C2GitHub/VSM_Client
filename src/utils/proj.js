const fs = window.require('fs');
const path = window.require('path');

const CONFIG_PATH = path.join(__static, '/config/proj.d');

let utils = {
   get(key) {
    let confData = fs.readFileSync(CONFIG_PATH);
    confData = confData.toString()
    confData = confData ? confData : "{}"
    let conf;

    try {
      conf = JSON.parse(confData)
    } catch (error) {
      conf = {}
    }

    if (conf.hasOwnProperty(key)) {
      return conf[key];
    };
    return undefined
  },
  
  set(key, value) {
    let confData = fs.readFileSync(CONFIG_PATH);
    confData = confData.toString();
    confData = confData ? confData : "{}"
    let conf = JSON.parse(confData);
    
    conf[key] = value;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf));
  },

  getAllProj() {
    let confData = fs.readFileSync(CONFIG_PATH);
    confData = confData.toString()
    confData = confData ? confData : "[]"
    let conf;

    try {
      conf = JSON.parse(confData)
    } catch (error) {
      conf = []
    }
    return conf;
  },
  save(projObj) {
    if(!projObj || typeof projObj !== 'object') return;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(projObj));
  }
}

module.exports = utils