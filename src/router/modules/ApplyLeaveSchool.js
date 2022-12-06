// 每一个js对应一个页面
// 此js文件对应申请出入校页面
import Layout from '@/layout'

export default {
  path: '/apply',
  component: Layout,
  redirect: '/apply/leaveschool',
  name: 'applyLeaveSchool',
  meta: {
    title: '出入校申请',
    icon: 'dashboard'
  },
  children: [
    {
      path: '/apply/leaveschool',
      name: 'applyLeaveSchool',
      component: () => import(''),
      meta: {
        title: '出校申请',
        icon: 'personnel'
      }
    }
  ]
}
