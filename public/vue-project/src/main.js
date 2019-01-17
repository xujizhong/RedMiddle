import Vue from 'vue'
import lodash from 'lodash'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor' //富文本
import feather from 'vue-icon'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/styles/index.css' // global css
import global from '@/js/global.js' // global js


Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.use(feather, 'v-icon')

Vue.prototype._ = lodash;
Vue.prototype.moment = moment;
Vue.prototype.global = global;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
