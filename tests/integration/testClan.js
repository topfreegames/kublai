// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const helper = require('./helper')

describe('Integration', () => {
  describe('Clan Test Handler', () => {
    it('Should create clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, 'clan-id', 'clan-id',
          (clanRes) => {
            clanRes.success.should.equal(true)
            clanRes.publicID.should.equal('clan-id')
            done()
          })
        })
      })
    })

    it('Should not create clan if missing gameId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.createClan'
          const payload = {
            publicID: clanId,
            ownerPublicID: playerId,
            name: clanId,
            metadata: {},
            allowApplication: true,
            autoJoin: false,
          }

          self.pomeloClient.request(reqRoute, payload, (clanRes) => {
            clanRes.success.should.equal(false)
            clanRes.reason.should.equal(
              'No game id was provided. Please include gameID in your payload.'
            )
            done()
          })
        })
      })
    })

    it('Should update clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.updateClan'
            const updatePayload = {
              gameID: gameId,
              publicID: clanId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicID: playerId,
              allowApplication: true,
              autoJoin: false,
            }

            self.pomeloClient.request(reqRoute, updatePayload, (updateClanRes) => {
              updateClanRes.success.should.equal(true)
              done()
            })
          })
        })
      })
    })

    it('Should not update clan if missing gameId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.updateClan'
            const updatePayload = {
              publicID: clanId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicID: playerId,
              allowApplication: true,
              autoJoin: false,
            }

            self.pomeloClient.request(reqRoute, updatePayload, (updateClanRes) => {
              updateClanRes.success.should.equal(false)
              updateClanRes.reason.should.equal(
                'No game id was provided. Please include gameID in your payload.'
              )
              done()
            })
          })
        })
      })
    })

    it('Should not update clan if missing clanId', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.updateClan'
            const updatePayload = {
              gameID: gameId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicID: playerId,
              allowApplication: true,
              autoJoin: false,
            }

            self.pomeloClient.request(reqRoute, updatePayload, (updateClanRes) => {
              updateClanRes.success.should.equal(false)
              updateClanRes.reason.should.equal(
                'No clan id was provided. Please include publicID in your payload.'
              )
              done()
            })
          })
        })
      })
    })

    it('Should retrieve clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.getClan'
            const payload = {
              gameID: gameId,
              publicID: clanId,
            }
            self.pomeloClient.request(reqRoute, payload, (getClanRes) => {
              getClanRes.success.should.equal(true)
              getClanRes.name.should.equal(clanId)
              getClanRes.members.length.should.equal(0)
              JSON.stringify(getClanRes.metadata).should.equal('{}')
              done()
            })
          })
        })
      })
    })

    it('Should leave the clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.leaveClan'
            const payload = {
              gameID: gameId,
              publicID: clanId,
              ownerPublicID: playerId,
            }
            self.pomeloClient.request(reqRoute, payload, (leaveClanRes) => {
              leaveClanRes.success.should.equal(true)
              done()
            })
          })
        })
      })
    })

    it('Should not leave the clan if wrong ownerPublicID', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.leaveClan'
            const payload = {
              gameID: gameId,
              publicID: clanId,
              ownerPublicID: helper.getRandomId(),
            }
            self.pomeloClient.request(reqRoute, payload, (leaveClanRes) => {
              leaveClanRes.success.should.equal(false)
              leaveClanRes.code.should.equal(500)
              done()
            })
          })
        })
      })
    })
  })
})
