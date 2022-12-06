import { privateRoutes, publicRoutes } from '@/router'
export default {
  namespaced: true,
  state: () => ({
    // 路由表：初始时所拥有的路由表
    routes: publicRoutes
  }),
  mutations: {
    /**
     * 增加路由
     */
    setRoutes(state, newRoutes) {
      state.routes = [...publicRoutes, ...newRoutes]
    }
  },
  actions: {
    /**
     * 根据权限数据筛选路由
     * @param {*} context
     * @param {*} menus 权限数据
     */
    filterRoutes(context, menus) {
      const routes = []

      menus.forEach(key => {
        routes.push(...privateRoutes.filter(item => item.name === key))
      })
      // 所有不匹配的路由，全部进入404
      // 该配置必须再所有路由指定之后
      routes.push({ path: '*', redirect: '/404', hidden: true })

      context.commit('setRoutes', routes)

      return routes
    }
  }
}
