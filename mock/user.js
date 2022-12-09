
// const tokens = {
//   admin: {
//     token: 'admin-token'
//   },
//   editor: {
//     token: 'editor-token'
//   }
// }

// const users = {
//   'admin-token': {
//     roles: ['admin'],
//     introduction: 'I am a super administrator',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Super Admin'
//   },
//   'editor-token': {
//     roles: ['editor'],
//     introduction: 'I am an editor',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal Editor'
//   }
// }

module.exports = [
  // user login
  // {
  //   url: '/vue-admin-template/user/login',
  //   type: 'post',
  //   response: config => {
  //     const { username } = config.body
  //     const token = tokens[username]

  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: 'Account and password are incorrect.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: token
  //     }
  //   }
  // },
  {
    url: '/users/login',
    type: 'post',
    response: config => { // 这里有个我容易犯的错，response拼成reponse。。。
      return {
        code: 20000,
        data: {
          userId: 1,
          id: 'SY2221110',
          token: 'gaoigamnrgpwpg9wngogano8dua'
        }
      }
    }
  },
  // get user info
  // {
  //   url: '/vue-admin-template/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     const { token } = config.query
  //     const info = users[token]

  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },
  {
    url: '/users/getUserInfo',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          userId: 1,
          id: 'SY2221110',
          name: '田震',
          department: '软件学院',
          phone: '15936022797',
          roles: ['student', 'teacher'],
          permission: {
            menus: [
              'apply',
              'review',
              'manage',
              'dev'
            ],
            points: []
          }
        }
      }
    }
  },
  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
