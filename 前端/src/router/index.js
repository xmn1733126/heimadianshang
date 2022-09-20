import Vue from 'vue'
import VueRouter from 'vue-router'
import myLogin from '@/components/myLogin.vue'
import myHome from '@/components/myHome.vue'
import myWelcome from '@/components/myWelcome.vue'
import myUsers from '@/components/user/myUsers.vue'
import myRights from '@/components/power/myRights.vue'
import myRoles from '@/components/power/myRoles.vue'
import myCate from '@/components/goods/myCate.vue'
import myParams from '@/components/goods/myParams'
import myList from '@/components/goods/myList'
import myAdd from '@/components/goods/myAdd'
import myOrder from '@/components/order/myOrder'
import myReport from '@/components/report/myReport'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: myLogin },
    {
      path: '/home',
      component: myHome,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: myWelcome },
        { path: '/users', component: myUsers },
        { path: '/rights', component: myRights },
        { path: '/roles', component: myRoles },
        { path: '/categories', component: myCate },
        { path: '/params', component: myParams },
        { path: '/goods', component: myList },
        { path: '/goods/add', component: myAdd },
        { path: '/orders', component: myOrder },
        { path: '/reports', component: myReport }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
