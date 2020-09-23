const { getPort, open, close, read, Task } = require("../utils/SRport.js");

const state = {
  port: null,
  parser: null
};

const mutations = {
  GET_PORT: (state, data) => {
    if (data) {
      state.port = data.port;
      state.parser = data.parser;
    }
  }
};

const actions = {
  initPort({ commit, state }) {
    let _this = this;
    getPort().then(data => {
      commit("GET_PORT", data);
      // 端口错误自动延时重启
      if (data) {
        data.port.on('error', () => {
          state.port = {};
          state.parser = {};
          // setTimeout(() => {
          //   this.dispatch('initPort');
          // }, 50)
        })

        data.port.on('close', () => {
          state.port = null;
          state.parser = null;
          // setTimeout(() => {
          //   initPort();
          // }, 100)
        })
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
