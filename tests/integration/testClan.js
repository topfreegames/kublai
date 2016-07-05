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
            publicId: clanId,
            ownerPublicId: playerId,
            name: clanId,
            metadata: {},
            allowApplication: true,
            autoJoin: false,
          }

          self.pomeloClient.request(reqRoute, payload, (clanRes) => {
            clanRes.success.should.equal(false)
            clanRes.reason.should.equal(
              'No game id was provided.'
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
              gameId,
              publicId: clanId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicId: playerId,
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
              publicId: clanId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicId: playerId,
              allowApplication: true,
              autoJoin: false,
            }

            self.pomeloClient.request(reqRoute, updatePayload, (updateClanRes) => {
              updateClanRes.success.should.equal(false)
              updateClanRes.reason.should.equal(
                'No game id was provided.'
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
              gameId,
              name: clanId,
              metadata: { new: 'metadata' },
              ownerPublicId: playerId,
              allowApplication: true,
              autoJoin: false,
            }

            self.pomeloClient.request(reqRoute, updatePayload, (updateClanRes) => {
              updateClanRes.success.should.equal(false)
              updateClanRes.reason.should.equal(
                'No clan id was provided.'
              )
              done()
            })
          })
        })
      })
    })

    it('Should retrieve clan summary', function (done) {
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

            const reqRoute = 'metagame.sampleHandler.getClanSummary'
            const payload = {
              gameId,
              publicId: clanId,
            }
            self.pomeloClient.request(reqRoute, payload, (getClanRes) => {
              getClanRes.success.should.equal(true)
              getClanRes.name.should.equal(clanId)
              getClanRes.publicID.should.equal(clanId)
              getClanRes.allowApplication.should.be.true  // eslint-disable-line no-unused-expressions,max-len
              getClanRes.autoJoin.should.be.false  // eslint-disable-line no-unused-expressions,max-len
              getClanRes.metadata.should.be.empty  // eslint-disable-line no-unused-expressions,max-len
              getClanRes.membershipCount.should.equal(1)
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
              gameId,
              publicId: clanId,
            }
            self.pomeloClient.request(reqRoute, payload, (getClanRes) => {
              getClanRes.success.should.equal(true)
              getClanRes.name.should.equal(clanId)
              getClanRes.roster.length.should.equal(0)
              getClanRes.memberships.banned.length.should.equal(0)
              getClanRes.memberships.denied.length.should.equal(0)
              getClanRes.memberships.pending.length.should.equal(0)
              JSON.stringify(getClanRes.metadata).should.equal('{}')
              done()
            })
          })
        })
      })
    })

    it('Should list clans', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId1 = helper.getRandomId()
      const playerId2 = helper.getRandomId()
      const clanId1 = helper.getRandomId()
      const clanId2 = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId1, playerId1, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createPlayer(self.pomeloClient, gameId, playerId2, playerId2, (playerRes2) => {
            playerRes2.success.should.equal(true)

            helper.createClan(self.pomeloClient, gameId, playerId1, clanId1, clanId1,
            (clanRes1) => {
              clanRes1.success.should.equal(true)

              helper.createClan(self.pomeloClient, gameId, playerId2, clanId2, clanId2,
              (clanRes2) => {
                clanRes2.success.should.equal(true)

                const reqRoute = 'metagame.sampleHandler.listClans'
                const payload = {
                  gameId,
                }
                self.pomeloClient.request(reqRoute, payload, (listClansRes) => {
                  listClansRes.success.should.equal(true)
                  listClansRes.clans.length.should.equal(2)
                  listClansRes.clans.forEach(clan => {
                    clan.name.should.be.oneOf([clanId1, clanId2])
                    clan.publicID.should.be.oneOf([clanId1, clanId2])
                    JSON.stringify(clan.metadata).should.equal('{}')
                  })
                  done()
                })
              })
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
              gameId,
              publicId: clanId,
            }
            self.pomeloClient.request(reqRoute, payload, (leaveClanRes) => {
              leaveClanRes.success.should.equal(true)
              done()
            })
          })
        })
      })
    })

    it('Should search an existing clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const ownerId = helper.getRandomId()
      const clanId = helper.getRandomId()
      const clanName = 'clan with spaces'

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, ownerId, ownerId, (ownerRes) => {
          ownerRes.success.should.equal(true)

          helper.createClan(self.pomeloClient, gameId, ownerId, clanId, clanName, (clanRes) => {
            clanRes.success.should.equal(true)

            const reqRoute = 'metagame.sampleHandler.searchClans'
            const payload = {
              gameId,
              term: 'with spaces',
            }
            self.pomeloClient.request(reqRoute, payload, (searchRes) => {
              searchRes.success.should.equal(true)
              searchRes.clans.length.should.equal(1)
              searchRes.clans[0].name.should.equal(clanName)
              searchRes.clans[0].publicID.should.equal(clanId)

              done()
            })
          })
        })
      })
    })

    it('Should search and find multiple clans', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const ownerId = helper.getRandomId()
      const ownerId2 = helper.getRandomId()
      const clanId = helper.getRandomId()
      const clanName = 'clan with spaces'
      const clanId2 = helper.getRandomId()
      const clanName2 = 'clanwithoutspaces'
      const pClient = self.pomeloClient

      helper.createGame(pClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(pClient, gameId, ownerId, ownerId, (ownerRes) => {
          ownerRes.success.should.equal(true)

          helper.createPlayer(pClient, gameId, ownerId2, ownerId2, (ownerRes2) => {
            ownerRes2.success.should.equal(true)

            helper.createClan(pClient, gameId, ownerId, clanId, clanName, (clanRes) => {
              clanRes.success.should.equal(true)

              helper.createClan(pClient, gameId, ownerId2, clanId2, clanName2, (clanRes2) => {
                clanRes2.success.should.equal(true)

                const reqRoute = 'metagame.sampleHandler.searchClans'
                const payload = {
                  gameId,
                  term: 'clan',
                }
                pClient.request(reqRoute, payload, (searchRes) => {
                  searchRes.success.should.equal(true)
                  searchRes.clans.length.should.equal(2)

                  for (let i = 0; i < 2; i++) {
                    searchRes.clans[i].membershipCount.should.not.be.null  // eslint-disable-line no-unused-expressions,max-len
                  }

                  done()
                })
              })
            })
          })
        })
      })
    })

    it('Should fail if other user is not in clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const ownerId = helper.getRandomId()
      const ownerId2 = helper.getRandomId()
      const clanId = helper.getRandomId()
      const pClient = self.pomeloClient

      helper.createGame(pClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(pClient, gameId, ownerId, ownerId, (ownerRes) => {
          ownerRes.success.should.equal(true)

          helper.createPlayer(pClient, gameId, ownerId2, ownerId2, (ownerRes2) => {
            ownerRes2.success.should.equal(true)

            helper.createClan(pClient, gameId, ownerId, clanId, clanId, (clanRes) => {
              clanRes.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.transferClanOwnership'
              const payload = {
                gameId,
                clanId,
                playerPublicId: ownerId2,
              }
              pClient.request(reqRoute, payload, (searchRes) => {
                searchRes.success.should.equal(false)

                done()
              })
            })
          })
        })
      })
    })

    it('Should transfer ownership to other player', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const ownerId = helper.getRandomId()
      const ownerId2 = helper.getRandomId()
      const clanId = helper.getRandomId()
      const pClient = self.pomeloClient

      helper.createGame(pClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(pClient, gameId, ownerId, ownerId, (ownerRes) => {
          ownerRes.success.should.equal(true)

          helper.createClan(pClient, gameId, ownerId, clanId, clanId, (clanRes) => {
            clanRes.success.should.equal(true)

            helper.createPlayerAndMembership(pClient, gameId, ownerId, clanId, 'member', ownerId2,
            (ownerRes2) => {
              ownerRes2.success.should.equal(true)

              const reqRoute = 'metagame.sampleHandler.transferClanOwnership'
              const payload = {
                gameId,
                clanId,
                playerPublicId: ownerId2,
              }
              pClient.request(reqRoute, payload, (transferRes) => {
                transferRes.success.should.equal(true)

                done()
              })
            })
          })
        })
      })
    })
  })
})
