import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

Vue.use(VueRouter)

// 添加登入验证钩子



const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Mainpage.vue'),
    children:[
      {
        path:'chatRoom',
        component: () => import(/* webpackChunkName: "about" */ '../views/chatRoom.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path:'Login',
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path:'memberManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/memberManage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path:'unitManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/unitManage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path:'dataAnalysis',
        component: () => import(/* webpackChunkName: "about" */ '../views/dataAnalysis.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path:'dataRefer',
        component: () => import(/* webpackChunkName: "about" */ '../views/dataRefer.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
]



const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 先验证本地是否有token，如果有的话就导航顺利。
  let token = window.localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (token) {
      try{
        store.dispatch('getUser')
      // 发出一个获取用户信息的请求，但如果这边返回error，会否执行。
         next()
      }
      catch(err){
        next({
          path: '/login',
          // 传递跳转参数
          query: { redirect: to.fullPath }
        })
      }
    } else {
      // 没有token的话就要logOut清空下数据？
      store.dispatch('logOut')
      next({
        path: '/login',
        // 传递跳转参数
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
