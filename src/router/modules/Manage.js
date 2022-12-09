// 每一个js对应一个页面
// 此js文件对应权限管理页面
import Layout from '@/layout'

/**
 * 这里需要考虑添加申请管理、审批管理的功能，单独的两个或一个页面
*/
export default {
  name: 'manage',
  path: '/manage',
  component: Layout,
  redirect: '/manage/usermanage',
  meta: {
    title: '权限管理',
    icon: 'auth'
  },
  children: [
    {
      path: '/manage/usermanage',
      name: 'userManage',
      component: () => import('@/views/userManage/index'),
      meta: {
        title: '用户管理',
        icon: 'user'
      }
    },
    {
      path: '/manage/rolemanage',
      name: 'roleManage',
      component: () => import('@/views/roleManage/index'),
      meta: {
        title: '角色管理',
        icon: 'role'
      }
    }
  ]
}
