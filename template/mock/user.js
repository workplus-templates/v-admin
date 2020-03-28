const tokens = {
  'admin': 'admin-token',
  'user': 'user-token'
}

export default [
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      if (!token) {
        return {
          code: -1,
          message: '用户名不正确'
        }
      }

      return {
        code: 20000,
        data: { token }
      }
    }
  }
]
