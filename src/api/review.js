import request from '@/utils/request'

// 查询我的审批（老师） TODO: 尚不清楚能否正常使用
export function fetchMyReview(query) {
  return request({
    url: 'review/listForm',
    method: 'get',
    params: query
  })
}
