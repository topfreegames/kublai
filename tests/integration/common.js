const pomeloClient = require('./../pomeloClient')

// chai
const chai = require('chai')
chai.use(require('chai-datetime'))
chai.use(require('chai-string'))
global.chai = chai

// should style
global.should = require('chai').should()

// expect style
global.expect = require('chai').expect

// assert style
global.assert = require('chai').assert

// test coverage
require('blanket')

process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.LOG_LEVEL = 'none'

global.serversConfig = {
  connector: {
    host: '127.0.0.1',
    port: 4050,
    clientHost: '127.0.0.1',
    clientPort: 3010,
    frontend: true,
  },
  metagame: {
    host: '127.0.0.1',
    port: 3334,
    clientHost: '127.0.0.1',
    clientPort: 3333,
    frontend: true,
  },
}


beforeEach(function (done) {
  const self = this
  self.pomeloClient = pomeloClient

  self.pomeloClient.init({
    host: global.serversConfig.metagame.clientHost,
    port: global.serversConfig.metagame.clientPort,
    player: {},
  }, () => {
    done()
  })
})

afterEach(function (done) {
  const self = this
  self.pomeloClient.disconnect()
  done()
})
