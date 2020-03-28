const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')

const mockDir = path.join(process.cwd(), 'mock')

function registerRoutes(app) {
  const { default: mocks } = require('./index.js')
  for (const mock of mocks) {
    app[mock.type](mock.url, mock.response)
  }
  const mockRoutesLength = Object.keys(mocks).length
  const mockRouteStartIndex = app._router.stack.length - mockRoutesLength
  return {
    mockRoutesLength,
    mockRouteStartIndex
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

module.exports = app => {
  // es6 polyfill
  require('@babel/register')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)
  let mockRouteStartIndex = mockRoutes.mockRouteStartIndex
  let mockRoutesLength = mockRoutes.mockRoutesLength

  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'add' || event === 'change') {
      try {
        app._router.stack.splice(mockRouteStartIndex, mockRoutesLength)
        unregisterRoutes()
        registerRoutes(app)
        mockRouteStartIndex = mockRoutes.mockRouteStartIndex
        mockRoutesLength = mockRoutes.mockRoutesLength
        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
