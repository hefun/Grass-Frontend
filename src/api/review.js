import request from '@/utils/request'

// 查询我的审批（老师） TODO: 尚不清楚能否正常使用
export function fetchMyReview(query) {
  return request({
    url: '/apply/listTo',
    method: 'get',
    params: query
  })
}

// 查询所有审批
export function fetchAllReview(query) {
  return request({
    url: '/apply/all',
    method: 'get',
    params: query
  })
}

export function updateReview(data) {
  return request({
    url: '/apply/approval',
    method: 'post',
    data
  })
}
