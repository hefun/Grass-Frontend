import request from '@/utils/request'

//  提交出校申请
export function addApply(data) {
  return request({
    url: '/apply/addApply',
    method: 'post',
    data
  })
}

// 查询我的申请（学生） TODO: 尚不清楚能否正常使用
export function fetchMyApply(sid) {
  return request({
    url: 'apply/list',
    method: 'get',
    params: { sid }
  })
}
