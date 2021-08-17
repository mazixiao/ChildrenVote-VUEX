// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/scss/reset.scss'
import '@/assets/scss/common.scss'
// 1366设计稿适配iPad
import rem from '@/assets/js/rem'
// rem手淘适配
import 'lib-flexible'
//引入store(vuex)
import store from './store'

Vue.config.silent = true

// ajax
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.prototype.$axios = axios;   // 2、在vue中使用axios


Vue.use(VueAxios, axios);

// 省市区插件
import AwesomePicker from 'vue-awesome-picker';
Vue.use(AwesomePicker);

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
Vue.use(VueDPlayer);


Vue.config.productionTip = false
// 全局前置守卫
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});


router.afterEach((to, from, next) => {

  window, scrollTo(0, 0)

})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

// 1366设计稿适配iPad
// rem.getSize()