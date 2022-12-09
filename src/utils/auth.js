import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/** Cookie中针对UserId的操作*/

export function setUserId(userId) {
  return Cookies.set('userId', userId)
}

export function getUserId() {
  return Cookies.get('userId')
}

export function removeUserId() {
  return Cookies.remove('userId')
}
