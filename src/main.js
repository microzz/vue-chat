// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment';
import Vuex from 'vuex';
import axios from 'axios'
import VueAxios from 'vue-axios'

// 本地化，中文时间显示
moment.locale('zh-cn');

Vue.prototype.moment = moment;

Vue.prototype.random = n => Math.floor(n * Math.random());

// Vuex
Vue.use(Vuex);

// axios
Vue.use(VueAxios, axios);

const store = new Vuex.Store({
  state: {
    name: '',
    // avatarUrl: `https://icdn.microzz.com/20170426_vue_chat/icon-avatar${Vue.prototype.random(21)}.svg`,
    avatarUrl: `http://omratag7g.bkt.clouddn.com/icon-avatar${Vue.prototype.random(21)}.svg`,
    addr: '未知',
    isShowAbout: false
  },

  mutations: {
    changeName(state, name) {
      state.name = name;
    },
    setAddr(state, addr) {
      state.addr = addr;
    },
    showAbout(state, flag) {
      state.isShowAbout = flag;
    }
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
