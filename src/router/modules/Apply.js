// 每一个js对应一个页面
// 此js文件对应申请出入校页面
import Layout from '@/layout'

export default {
  name: 'apply',
  path: '/apply',
  component: Layout,
  redirect: '/apply/myapply',
  meta: {
    title: '出入校申请',
    icon: 'guide'
  },
  children: [
    {
      name: 'myApply',
      path: '/apply/myapply',
      component: () => import('@/views/myApply/index'),
      meta: {
        title: '我的申请',
        icon: 'list'
      }
    },
    {
      name: 'applyLeaveSchool',
      path: '/apply/leaveschool',
      component: () => import('@/views/applyLeaveSchool/index'),
      meta: {
        title: '出校申请',
        icon: 'form'
      }
    }
  ]
}
