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
          createHookRes.publicID.should.not.equal(null)
          done()
        })
      })
    })

    it('Should not create hook if game ID is not provided', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)

        const reqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
        }

        self.pomeloClient.request(reqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(false)
          createHookRes.reason.should.equal(
            'Error: No game id was provided. Operation: createHook.'
          )
          done()
        })
      })
    })

    it('Should not create hook if hook Type is not provided', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const reqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookURL: 'http://test.com/test',
        }

        self.pomeloClient.request(reqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(false)
          createHookRes.reason.should.equal(
            'Error: No hook type was provided. Operation: createHook.'
          )
          done()
        })
      })
    })

    it('Should not create hook if hook url is not provided', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const reqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookType: 1,
        }

        self.pomeloClient.request(reqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(false)
          createHookRes.reason.should.equal(
            'Error: No hook URL was provided. Operation: createHook.'
          )
          done()
        })
      })
    })


    it('Should remove hook', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const createReqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookType: 1,
          hookURL: 'http://test.com/test',
        }

        self.pomeloClient.request(createReqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.removeHook'
          const removeHookPayload = {
            gameId,
            publicId: createHookRes.publicID,
          }
          self.pomeloClient.request(reqRoute, removeHookPayload, (removeHookRes) => {
            removeHookRes.success.should.equal(true)
            done()
          })
        })
      })
    })

    it('Should not remove hook if missing gameID', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const createReqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookType: 1,
          hookURL: 'http://test.com/test',
        }

        self.pomeloClient.request(createReqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.removeHook'
          const removeHookPayload = {
          }
          self.pomeloClient.request(reqRoute, removeHookPayload, (removeHookRes) => {
            removeHookRes.success.should.equal(false)
            removeHookRes.reason.should.equal(
              'Error: No game id was provided. Operation: removeHook.'
            )
            done()
          })
        })
      })
    })

    it('Should not remove hook if missing publicID', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const createReqRoute = 'metagame.sampleHandler.createHook'
        const createHookPayload = {
          gameId,
          hookType: 1,
          hookURL: 'http://test.com/test',
        }

        self.pomeloClient.request(createReqRoute, createHookPayload, (createHookRes) => {
          createHookRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.removeHook'
          const removeHookPayload = {
            gameId,
          }
          self.pomeloClient.request(reqRoute, removeHookPayload, (removeHookRes) => {
            removeHookRes.success.should.equal(false)
            removeHookRes.reason.should.equal(
               'Error: No hook public id was provided. Operation: removeHook.'
            )
            done()
          })
        })
      })
    })
  })
})
