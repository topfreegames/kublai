// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const helper = require('./helper')

describe('Integration', () => {
  describe('Membership Test Handler', () => {
    it('Should apply for membership', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const applicantId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
            applicantRes.success.should.equal(true)

            helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
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
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const applicantId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, applicantId, playerId, (applicantRes) => {
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
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const applicantId = helper.getRandomId()
          const clanId = helper.getRandomId()
          const level = 1

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, applicantId, playerId,
              (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
                  clanRes.success.should.equal(true)

                  helper.createMembershipApplication(self.pomeloClient, gameId, clanId, level,
                  applicantId, (applicationRes) => {
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
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const applicantId = helper.getRandomId()
          const clanId = helper.getRandomId()
          const level = 1

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, applicantId, playerId,
              (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
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
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const memberId = helper.getRandomId()
          const applicantId = helper.getRandomId()
          const clanId = helper.getRandomId()
          const requestorLevel = 0
          const level = 1

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, memberId, memberId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
                  clanRes.success.should.equal(true)

                  helper.acceptOrDenyMembership(self.pomeloClient, gameId, playerId, clanId,
                  requestorLevel, test.action, memberId, (membershipRes) => {
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

    it('Should invite for membership', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const inviteeId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createPlayer(self.pomeloClient, gameId, inviteeId, playerId, (applicantRes) => {
            applicantRes.success.should.equal(true)

            helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
              clanRes.success.should.equal(true)


              const reqRoute = 'metagame.sampleHandler.inviteForMembership'
              const payload = {
                gameID: gameId,
                publicID: clanId,
                level: 1,
                playerPublicID: inviteeId,
                requestorPublicID: playerId,
              }
              self.pomeloClient.request(reqRoute, payload, (inviteForMembershipRes) => {
                inviteForMembershipRes.success.should.equal(true)
                done()
              })
            })
          })
        })
      })
    })

    it('Should not invite for unexistent clan', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const inviteeId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, inviteeId, playerId, (applicantRes) => {
          applicantRes.success.should.equal(true)

          const reqRoute = 'metagame.sampleHandler.inviteForMembership'
          const payload = {
            gameID: gameId,
            publicID: clanId,
            level: 1,
            playerPublicID: inviteeId,
            requestorPublicID: playerId,
          }
          self.pomeloClient.request(reqRoute, payload, (inviteForMembershipRes) => {
            inviteForMembershipRes.success.should.equal(false)
            inviteForMembershipRes.code.should.equal(500)
            done()
          })
        })
      })
    })

    it('Should not invite if do not have rights to', function (done) {
      const self = this
      const gameId = helper.getRandomId()
      const playerId = helper.getRandomId()
      const memberId = helper.getRandomId()
      const inviteeId = helper.getRandomId()
      const clanId = helper.getRandomId()

      helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
        res.success.should.equal(true)

        helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
          playerRes.success.should.equal(true)

          helper.createPlayer(self.pomeloClient, gameId, memberId, memberId, (applicantRes) => {
            applicantRes.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, inviteeId, inviteeId, (memberRes) => {
              memberRes.success.should.equal(true)

              helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId, (clanRes) => {
                clanRes.success.should.equal(true)

                helper.createMembership(self.pomeloClient, gameId, playerId, clanId, 0, memberId,
                (membershipRes) => {
                  membershipRes.success.should.equal(true)

                  const reqRoute = 'metagame.sampleHandler.inviteForMembership'
                  const payload = {
                    gameID: gameId,
                    publicID: clanId,
                    level: 1,
                    playerPublicID: inviteeId,
                    requestorPublicID: memberId,
                  }
                  self.pomeloClient.request(reqRoute, payload, (inviteForMembershipRes) => {
                    inviteForMembershipRes.success.should.equal(false)
                    inviteForMembershipRes.reason.should.equal('Could not process request: ' +
                      `Player ${memberId} cannot create membership for clan ${clanId}`)
                    inviteForMembershipRes.code.should.equal(500)
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
