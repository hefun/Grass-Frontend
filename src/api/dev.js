import request from '@/utils/request'

//  提交出校申请
export function genCode(data) {
  return request({
    url: '/generate/code',
    method: 'post',
    data
  })
}
