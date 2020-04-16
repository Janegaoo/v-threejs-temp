/*
 * @Author: Jane
 * @Date: 2020-04-14 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-16 10:33:12
 * @Descripttion:
 */
import Vue from 'vue';
import App from './index.vue';
import router from '@/router/';
import store from '@/store/';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
