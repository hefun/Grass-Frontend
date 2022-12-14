const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  id: state => state.user.id,
  department: state => state.user.department,
  phone: state => state.user.phone,
  roles: state => state.user.roles,
  permission: state => state.user.permission
}
export default getters
