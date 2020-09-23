// import Cookies from 'js-cookie'
import Config from '../../utils/config'
const fs = window.require('fs')
const path = window.require('path')

if (!fs.existsSync(path.join(Config.appPath, 'photo'))) {
  fs.mkdirSync(path.join(Config.appPath, 'photo'))
}

const state = {
  sidebar: {
    opened: Config.get('sidebarStatus') ? !!Config.get('sidebarStatus') : false,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Config.get('size') || 'medium',
  triggerCode: Config.get('triggerCode') ? Config.get('triggerCode') : '8888',
  imgsPath: Config.get('imgsPath') ? Config.get('imgsPath') : path.join(Config.appPath, 'photo')
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Config.set('sidebarStatus', 1)
    } else {
      Config.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Config.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Config.set('size', size)
  },
  SET_TRIGGERCODE: (state, triggerCode) => {
    state.triggerCode = triggerCode
    Config.set('triggerCode', triggerCode)
  },
  SET_IMGSPATH: (state, imgsPath) => {
    state.imgsPath = imgsPath
    Config.set('imgsPath', imgsPath)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  settriggerCode({ commit }, triggerCode) {
    commit('SET_TRIGGERCODE', triggerCode)
  },
  setImgsPath({ commit }, imgsPath) {
    commit('SET_IMGSPATH', imgsPath)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
