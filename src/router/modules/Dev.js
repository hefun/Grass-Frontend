// 每一个js对应一个页面
// 此js文件 出入校审批
import Layout from '@/layout'

export default {
  name: 'dev',
  path: '/dev',
  component: Layout,
  redirect: '/dev/dashboard',
  meta: {
    title: '后台管理',
    icon: 'mgmt'
  },
  children: [
    {
      name: 'allReview',
      path: '/dev/allReview',
      component: () => import('@/views/allReview/index'),
      meta: {
        title: '全部申请',
        icon: 'list'
      }
    },
    {
      name: 'genTableCRUD',
      path: '/dev/dbCodeGen',
      component: () => import('@/views/genTableCRUD/index'),
      meta: {
        title: '代码生成',
        icon: 'code'
      }
    }
  ]
}
