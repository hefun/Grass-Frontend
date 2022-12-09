import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/users/getUserInfo',
    method: 'get',
    params: {
      id: id
    }
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

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

export function deleteUser(userId) {
  return request({
    url: `/users/deleteUser/${userId}`,
    method: 'delete'
  })
}

export function getTeachers(department) {
  return request({
    url: '/users/getTeachers',
    method: 'get',
    params: department
  })
}

export function updateUserRole(data) {
  return request({
    url: '/users/updateUserRole',
    method: 'post',
    data
  })
}
