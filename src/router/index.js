import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
import Apply from './modules/Apply'
import Review from './modules/Review'
import Manage from './modules/Manage'
import Dev from './modules/Dev'
import store from '@/store'
/**
 * priviteRoutes
 */
export const privateRoutes = [
  Apply,
  Review,
  Manage,
  Dev
]

/**
 * publicRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: publicRoutes
})

const router = createRouter()
console.log(router)
console.log(router.options.routes)
// 初始化路由表
export function resetRouter() {
  if (store.getters.permission && store.getters.permission.menus) {
    const size = store.getters.permission.menus.length + 1
    for (let i = 0; i < size; i++) {
      console.log(router.options.routes)
      router.options.routes.pop()
    }
  }
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
