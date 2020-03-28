import Mock from 'mockjs'
import user from './user'

const mocks = [
  ...user
]

// for mock server
const responseFake = (url, type, response) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(response instanceof Function ? response(req, res) : response))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
