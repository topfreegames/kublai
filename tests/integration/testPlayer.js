// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const helper = require('./helper')

describe('Integration', () => {
  describe('Player Test Handler', () => {
    it('Should create player', function (done) {
      const self = this
      const gameId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, 'player-id', 'player-name', (playerRes) => {
          playerRes.success.should.equal(true)
          playerRes.publicID.should.equal('player-id')
          done()
        })
      })
    })

    it('Should not create player if missing gameId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        const reqRoute = 'metagame.sampleHandler.createPlayer'
        const payload = {
          publicId: playerId,
          name: playerId,
          metadata: {},
        }

        self.pomeloClient.request(reqRoute, payload, (playerRes) => {
          playerRes.success.should.equal(false)
          playerRes.reason.should.equal(
            'No game id was provided.'
          )
          done()
        })
      })
    })

    it('Should update player', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            gameId,
            publicId: playerId,
            name: playerId,
            metadata: { new: 'metadata' },
          }

          self.pomeloClient.request(reqRoute, updatePayload, (updatePlayerRes) => {
            updatePlayerRes.success.should.equal(true)
            done()
          })
        })
      })
    })

    it('Should not update player if missing gameId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            publicId: playerId,
            name: playerId,
            metadata: { new: 'metadata' },
          }

          self.pomeloClient.request(reqRoute, updatePayload, (updatePlayerRes) => {
            updatePlayerRes.success.should.equal(false)
            updatePlayerRes.reason.should.equal(
              'No game id was provided.'
            )
            done()
          })
        })
      })
    })

    it('Should not update players if missing playerId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            gameId,
            name: playerId,
            metadata: { new: 'metadata' },
          }

          self.pomeloClient.request(reqRoute, updatePayload, (updatePlayerRes) => {
            updatePlayerRes.success.should.equal(false)
            updatePlayerRes.reason.should.equal(
              'No player id was provided.'
            )
            done()
          })
        })
      })
    })

    it('Should get player', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.getPlayer'
          const payload = {
            gameId,
            publicId: playerId,
          }

          self.pomeloClient.request(reqRoute, payload, (getPlayerRes) => {
            getPlayerRes.success.should.equal(true)
            getPlayerRes.publicID.should.equal(playerId)
            getPlayerRes.name.should.equal(playerId)
            getPlayerRes.clans.approved.length.should.equal(0)
            getPlayerRes.clans.banned.length.should.equal(0)
            getPlayerRes.clans.denied.length.should.equal(0)
            getPlayerRes.clans.pendingApplications.length.should.equal(0)
            getPlayerRes.clans.pendingInvites.length.should.equal(0)
            getPlayerRes.memberships.length.should.equal(0)
            getPlayerRes.createdAt.should.equal(getPlayerRes.updatedAt)
            done()
          })
        })
      })
    })

    describe('Should not get player if missing', () => {
      const tests = [
        { desc: 'gameId', delete: 'gameId' },
        { desc: 'playerId', delete: 'publicId' },
      ]
      tests.forEach(test => {
        it(test.desc, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.getPlayer'
              const payload = {
                gameId,
                publicId: playerId,
              }
              delete payload[test.delete]

              self.pomeloClient.request(reqRoute, payload, (getPlayerRes) => {
                getPlayerRes.success.should.equal(false)
                getPlayerRes.code.should.equal(500)
                done()
              })
            })
          })
        })
      })
    })

    describe('Should not get player if unexistent', () => {
      const tests = [
        { desc: 'gameId', field: 'gameId', val: helper.getRandomId() },
        { desc: 'playerId', field: 'publicId', val: helper.getRandomId() },
      ]
      tests.forEach(test => {
        it(test.desc, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.getPlayer'
              const payload = {
                gameId,
                publicId: playerId,
              }
              payload[test.field] = test.val
              self.pomeloClient.request(reqRoute, payload, (getPlayerRes) => {
                getPlayerRes.success.should.equal(false)
                getPlayerRes.code.should.equal(500)
                done()
              })
            })
          })
        })
      })
    })
  })
})
