import Vue from 'vue'
import Router from 'vue-router'




import index from '@/views/index'
import commitRecord from '@/views/commitRecord'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
				title: '儿童节投票'
			}
    },
    {
      path: '/commitRecord',
      name: 'commitRecord',
      component: commitRecord,
      meta: {
				title: '儿童节投票'
			}
    }
  ]
})

// 解决路由重复报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

