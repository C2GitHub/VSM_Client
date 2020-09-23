// const {get}=require("sortablejs");

const fs = window.require('fs');
const path = window.require('path');

const CONFIG_PATH = path.join(__static, '/config/conf.d');

let utils = {
   get(key) {
    let confData = fs.readFileSync(CONFIG_PATH);
    confData = confData.toString()
    confData = confData ? confData : "{}"
    let conf = JSON.parse(confData);

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
    
    console.log(key, value);

    conf[key] = value;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf))
  }
}

module.exports = utils