// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const helper = require('./helper')

describe('Integration', () => {
  describe('Hook Test Handler', () => {
    it('Should create hook', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const reqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookType: 1,
          hookURL: 'http://test.com/test',
        }

        self.pomeloClient.request(reqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(true)
          done()
        })
      })
    })
  })
})
