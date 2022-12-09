import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/users/getUserInfo',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUsers(data) {
  return request({
    url: '/users/getUsers',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/updateUser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/users/deleteUser',
    method: 'post',
    data
  })
}

export function getTeachers(data) {
  return request({
    url: '/users/getTeachers',
    method: 'post',
    data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/users/updateUserRole',
    method: 'post',
    data
  })
}
