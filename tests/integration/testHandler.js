// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const uuid = require('node-uuid')

function getRandomId() {
  return uuid.v4()
}

function createGame(client, id, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createGame'
  const payload = {
    publicID: id,
    name,
    metadata: {},
    minMembershipLevel: 1,
    maxMembershipLevel: 5,
    minLevelToAcceptApplication: 1,
    minLevelToCreateInvitation: 2,
    minLevelOffsetToPromoteMember: 3,
    minLevelOffsetToDemoteMember: 3,
    minLevelOffsetToRemoveMember: 1,
    minLevelToRemoveMember: 3,
    allowApplication: true,
    maxMembers: 30,
  }

  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

function createPlayer(client, gameId, id, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createPlayer'
  const payload = {
    gameID: gameId,
    publicID: id,
    name,
    metadata: {},
  }

  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

function createClan(client, gameId, ownerId, id, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createClan'
  const payload = {
    gameID: gameId,
    publicID: id,
    ownerPublicID: ownerId,
    name,
    metadata: {},
    allowApplication: true,
    autoJoin: false,
  }

  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

describe('Integration', () => {
  describe('Game Test Handler', () => {
    it('Should create game', function (done) {
      createGame(this.pomeloClient, 'test-id', 'test-name', (res) => {
        res.success.should.equal(true)
        res.publicID.should.equal('test-id')
        done()
      })
    })

    it('Should update game', function (done) {
      const self = this
      const id = getRandomId()

      createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const reqRoute = 'metagame.sampleHandler.updateGame'
        const updatePayload = {
          publicID: gameId,
          name: id,
          metadata: {},
          minMembershipLevel: 2,
          maxMembershipLevel: 6,
          minLevelToAcceptApplication: 2,
          minLevelToCreateInvitation: 3,
          minLevelOffsetToPromoteMember: 4,
          minLevelOffsetToDemoteMember: 4,
          minLevelOffsetToRemoveMember: 1,
          minLevelToRemoveMember: 4,
          allowApplication: false,
          maxMembers: 20,
        }

        self.pomeloClient.request(reqRoute, updatePayload, (updateRes) => {
          updateRes.success.should.equal(true)
          done()
        })
      })
    })

    it('Should not update game is missing gameId', function (done) {
      const self = this
      const id = getRandomId()

      createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)

        const reqRoute = 'metagame.sampleHandler.updateGame'
        const updatePayload = {
          name: id,
          metadata: {},
          minMembershipLevel: 2,
          maxMembershipLevel: 6,
          minLevelToAcceptApplication: 2,
          minLevelToCreateInvitation: 3,
          minLevelOffsetToPromoteMember: 4,
          minLevelOffsetToDemoteMember: 4,
          minLevelOffsetToRemoveMember: 1,
          minLevelToRemoveMember: 4,
          allowApplication: false,
          maxMembers: 20,
        }

        self.pomeloClient.request(reqRoute, updatePayload, (updateRes) => {
          updateRes.success.should.equal(false)
          updateRes.reason.should.equal(
            'No game id was provided. Please include publicID in your payload.'
          )
          done()
        })
      })
    })
  })

  describe('Player Test Handler', () => {
    it('Should create player', function (done) {
      const self = this
      const gameId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, 'player-id', 'player-name', (playerRes) => {
          playerRes.success.should.equal(true)
          playerRes.publicID.should.equal('player-id')
          done()
        })
      })
    })

    it('Should not create player if missing gameId', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        const reqRoute = 'metagame.sampleHandler.createPlayer'
        const payload = {
          publicID: playerId,
          name: playerId,
          metadata: {},
        }

        self.pomeloClient.request(reqRoute, payload, (playerRes) => {
          playerRes.success.should.equal(false)
          playerRes.reason.should.equal(
            'No game id was provided. Please include gameID in your payload.'
          )
          done()
        })
      })
    })

    it('Should update player', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            gameID: gameId,
            publicID: playerId,
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
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            publicID: playerId,
            name: playerId,
            metadata: { new: 'metadata' },
          }

          self.pomeloClient.request(reqRoute, updatePayload, (updatePlayerRes) => {
            updatePlayerRes.success.should.equal(false)
            updatePlayerRes.reason.should.equal(
              'No game id was provided. Please include gameID in your payload.'
            )
            done()
          })
        })
      })
    })

    it('Should not update players if missing playerId', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.updatePlayer'
          const updatePayload = {
            gameID: gameId,
            name: playerId,
            metadata: { new: 'metadata' },
          }

          self.pomeloClient.request(reqRoute, updatePayload, (updatePlayerRes) => {
            updatePlayerRes.success.should.equal(false)
            updatePlayerRes.reason.should.equal(
              'No playerId id was provided. Please include publicID in your payload.'
            )
            done()
          })
        })
      })
    })
  })

  describe('Clan Test Handler', () => {
    it('Should create clan', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, 'clan-id', 'clan-id', (clanRes) => {
            clanRes.success.should.equal(true)
            clanRes.publicID.should.equal('clan-id')
            done()
          })
        })
      })
    })

    it('Should not create clan if missing gameId', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
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
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
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
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
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
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
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
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
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
  })
})
