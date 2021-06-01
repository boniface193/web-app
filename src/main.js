import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';
import VueApexCharts from 'vue-apexcharts';
import VueMeta from 'vue-meta';
import VueAnalytics from 'vue-analytics';

Vue.use(VueMeta)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(Chartkick.use(Chart))
Vue.use(require('vue-moment'));
// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'G-EF7LKNZ76Y',
  router
});


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
