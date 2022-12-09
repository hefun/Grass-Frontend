// 每一个js对应一个页面
// 此js文件 出入校审批
import Layout from '@/layout'

export default {
  name: 'review',
  path: '/review',
  component: Layout,
  redirect: '/review/myreview',
  meta: {
    title: '出入校审批',
    icon: 'approval'
  },
  children: [
    {
      name: 'myReview',
      path: '/review/myreview',
      component: () => import('@/views/myReview/index'),
      meta: {
        title: '我的审批',
        icon: 'list'
      }
    },
    {
      name: 'reviewLeaveSchool',
      path: '/review/leaveschool',
      component: () => import('@/views/reviewLeaveSchool/index'),
      meta: {
        title: '出校审批',
        icon: 'form'
      }
    }
  ]
}
