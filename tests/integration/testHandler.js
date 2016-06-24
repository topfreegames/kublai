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
    maxMembers: 30,
    membershipLevels: { member: 1, elder: 2, coleader: 3 },
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

function createMembershipApplication(client, gameId, clanId, level, applicantId, cb) {
  const reqRoute = 'metagame.sampleHandler.applyForMembership'
  const payload = {
    gameID: gameId,
    publicID: clanId,
    level,
    playerPublicID: applicantId,
  }
  client.request(reqRoute, payload, (applyForMembershipRes) => {
    cb(applyForMembershipRes)
  })
}

function createMeembership(client, gameId, ownerId, clanId, level, action, applicantId, cb) {
  const applyRoute = 'metagame.sampleHandler.applyForMembership'
  const applyPayload = {
    gameID: gameId,
    publicID: clanId,
    level,
    playerPublicID: applicantId,
  }
  const approveRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
  const approvepayload = {
    gameID: gameId,
    publicID: clanId,
    action,
    level,
    playerPublicID: applicantId,
    requestorPublicID: ownerId,
  }
  client.request(applyRoute, applyPayload, () => {
    client.request(approveRoute, approvepayload, (approveDenyMembershipApplicationRes) => {
      cb(approveDenyMembershipApplicationRes)
    })
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
          membershipLevels: { noob: 1, member: 2, elder: 3, coleader: 4 },
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

    it('Should get player', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.getPlayer'
          const payload = {
            gameID: gameId,
            publicID: playerId,
          }

          self.pomeloClient.request(reqRoute, payload, (getPlayerRes) => {
            getPlayerRes.success.should.equal(true)
            getPlayerRes.publicID.should.equal(playerId)
            getPlayerRes.name.should.equal(playerId)
            getPlayerRes.clans.approved.length.should.equal(0)
            getPlayerRes.clans.banned.length.should.equal(0)
            getPlayerRes.clans.denied.length.should.equal(0)
            getPlayerRes.clans.pending.length.should.equal(0)
            getPlayerRes.memberships.length.should.equal(0)
            getPlayerRes.createdAt.should.equal(getPlayerRes.updatedAt)
            done()
          })
        })
      })
    })

    describe('Should not get player if missing', () => {
      const tests = [
        { desc: 'gameID', delete: 'gameID' },
        { desc: 'playerID', delete: 'publicID' },
      ]
      tests.forEach(test => {
        it(test.desc, function (done) {
          const self = this
          const gameId = getRandomId()
          const playerId = getRandomId()

          createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.getPlayer'
              const payload = {
                gameID: gameId,
                publicID: playerId,
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
        { desc: 'gameID', field: 'gameID', val: getRandomId() },
        { desc: 'playerID', field: 'publicID', val: getRandomId() },
      ]
      tests.forEach(test => {
        it(test.desc, function (done) {
          const self = this
          const gameId = getRandomId()
          const playerId = getRandomId()

          createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.getPlayer'
              const payload = {
                gameID: gameId,
                publicID: playerId,
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

    it('Should leave the clan', function (done) {
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
      const gameId = getRandomId()
      const playerId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.leaveClan'
            const payload = {
              gameID: gameId,
              publicID: clanId,
              ownerPublicID: getRandomId(),
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

  describe('Membership Test Handler', () => {
    it('Should apply for membership', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()
      const applicantId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
            applicantRes.success.should.equal(true)

            createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
              clanRes.success.should.equal(true)


              const reqRoute = 'metagame.sampleHandler.applyForMembership'
              const payload = {
                gameID: gameId,
                publicID: clanId,
                level: 1,
                playerPublicID: applicantId,
              }
              self.pomeloClient.request(reqRoute, payload, (applyForMembershipRes) => {
                applyForMembershipRes.success.should.equal(true)
                done()
              })
            })
          })
        })
      })
    })

    it('Should not apply for unexistent clan', function (done) {
      const self = this
      const gameId = getRandomId()
      const playerId = getRandomId()
      const applicantId = getRandomId()
      const clanId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
          applicantRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.applyForMembership'
          const payload = {
            gameID: gameId,
            publicID: clanId,
            level: 1,
            playerPublicID: applicantId,
          }
          self.pomeloClient.request(reqRoute, payload, (applyForMembershipRes) => {
            applyForMembershipRes.success.should.equal(false)
            applyForMembershipRes.reason.should.equal('Could not process request: Clan was ' +
              `not found with id: ${clanId}`)
            applyForMembershipRes.code.should.equal(500)
            done()
          })
        })
      })
    })

    describe('Membership application should be', () => {
      const tests = [
        { descr: 'approved', action: 'approve' },
        { descr: 'denied', action: 'deny' },
      ]
      tests.forEach(test => {
        it(test.descr, function (done) {
          const self = this
          const gameId = getRandomId()
          const playerId = getRandomId()
          const applicantId = getRandomId()
          const clanId = getRandomId()
          const level = 1

          createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
                  clanRes.success.should.equal(true)

                  createMembershipApplication(self.pomeloClient, gameId, clanId, level, applicantId,
                  (applicationRes) => {
                    applicationRes.success.should.equal(true)

                    const reqRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      level,
                      playerPublicID: applicantId,
                      requestorPublicID: playerId,
                    }
                    self.pomeloClient.request(reqRoute, payload,
                    (approveDenyMembershipApplicationRes) => {
                      approveDenyMembershipApplicationRes.success.should.equal(true)
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

    describe('Membership application should not be', () => {
      const tests = [
        { descr: 'approved', action: 'approve' },
        { descr: 'denied', action: 'deny' },
      ]
      tests.forEach(test => {
        it(`${test.descr} if unexistent`, function (done) {
          const self = this
          const gameId = getRandomId()
          const playerId = getRandomId()
          const applicantId = getRandomId()
          const clanId = getRandomId()
          const level = 1

          createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
                  clanRes.success.should.equal(true)

                  const reqRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
                  const payload = {
                    gameID: gameId,
                    publicID: clanId,
                    action: test.action,
                    level,
                    playerPublicID: applicantId,
                    requestorPublicID: playerId,
                  }
                  self.pomeloClient.request(reqRoute, payload,
                  (approveDenyMembershipApplicationRes) => {
                    approveDenyMembershipApplicationRes.success.should.equal(false)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })

    describe('Membership application should not be', () => {
      const tests = [
        { descr: 'approved', action: 'approve' },
        { descr: 'denied', action: 'deny' },
      ]
      tests.forEach(test => {
        it(`${test.descr} if requestor cannot perform action`, function (done) {
          const self = this
          const gameId = getRandomId()
          const playerId = getRandomId()
          const memberId = getRandomId()
          const applicantId = getRandomId()
          const clanId = getRandomId()
          const requestorLevel = 0
          const level = 1

          createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              createPlayer(self.pomeloClient, gameId, memberId, memberId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
                  clanRes.success.should.equal(true)

                  createMeembership(self.pomeloClient, gameId, playerId, clanId, requestorLevel,
                  test.action, memberId, (membershipRes) => {
                    membershipRes.success.should.equal(true)

                    const reqRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      level,
                      playerPublicID: applicantId,
                      requestorPublicID: memberId,
                    }
                    self.pomeloClient.request(reqRoute, payload,
                    (approveDenyMembershipApplicationRes) => {
                      approveDenyMembershipApplicationRes.success.should.equal(false)
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
