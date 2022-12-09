import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// 除token在Cookies中也进行get/set外，其他都使用state进行操作
// 在进行权限管理的时候，会用到roles和permission的set
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userId: 0,
    id: '',
    department: '',
    phone: '',
    roles: [],
    permission: {
      menus: [],
      points: []
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_DEPARTMENT: (state, department) => {
    state.department = department
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.userId)
        commit('SET_ID', data.id)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id).then(response => {
        const data = response.data
        console.log(data)
        console.log(!data)

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, department, phone, roles, permission } = data
        const name = data.user.username
        const department = data.user.department
        const phone = data.user.phone
        const roles = data.user.roles
        const permission = data.permission

        commit('SET_NAME', name)
        commit('SET_DEPARTMENT', department)
        commit('SET_PHONE', phone)
        commit('SET_ROLES', roles)
        commit('SET_PERMISSION', permission)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

