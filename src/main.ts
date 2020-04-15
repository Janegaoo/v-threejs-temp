/*
 * @Author: Jane
 * @Date: 2020-04-14 10:53:30
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-15 17:21:17
 * @Descripttion:
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
