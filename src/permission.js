import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // const permission = store.getters.permission
        // // 处理用户权限，筛选出需要添加的路由
        // const filterRoutes = await store.dispatch('permission/filterRoutes', permission.menus)
        // // 循环添加动态路由
        // filterRoutes.forEach(item => {
        //   router.addRoute(item)
        // })
        // // 添加完动态路由之后，需要进行一次主动跳转
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          const permission = store.getters.permission
          // 处理用户权限，筛选出需要添加的路由
          const filterRoutes = await store.dispatch('permission/filterRoutes', permission.menus)
          // 循环添加动态路由
          filterRoutes.forEach(item => {
            router.options.routes.push(item)
            // console.log(router.addRoute(item))
            router.addRoute(item)
            // console.log(router.options.routes)
          })
          // 添加完动态路由之后，需要进行一次主动跳转
          next({ ...to, replace: true })
          // next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
