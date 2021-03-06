import Vue from 'vue'
import './plugins/fontawesome'
import './plugins/fontawesome'
import App from './App.vue'
import VueFire from 'vuefire'
import '@/assets/css/tailwind.css'


Vue.config.productionTip = false


Vue.use(VueFire);

new Vue({
  render: h => h(App),
}).$mount('#app')
