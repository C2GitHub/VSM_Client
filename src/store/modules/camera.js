// import Cookies from 'js-cookie'
const Util = require('../utils/index')
const state = {
  cameraNum: Util.get('cameraNum') != 0 ? Util.get('cameraNum') : 0,
  saveImage: Util.get('saveImage') == 0 ? Number(Util.get('saveImage')) : 1,
  imageCheck: Util.get('imageCheck') == 0 ? Number(Util.get('imageCheck')) : 1
}

const mutations = {
  SET_CAMERA_NUM: (state, num) => {
    state.cameraNum = num
    Util.set('cameraNum', num)
  },
  CAMERA_SETTINGS: (state, type) => {
    state[type] = state[type] == 0 ? 1 : 0
    Util.set(type, state[type])
  }
}

const actions = {
  changeCamera({ commit }, num) {
    commit('SET_CAMERA_NUM', num)
  },
  cangeCameraSettings({ commit }, type) {
    commit('CAMERA_SETTINGS', type)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
