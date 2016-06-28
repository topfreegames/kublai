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
                level: 'member',
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
            level: 'member',
            playerPublicID: applicantId,
          }
          self.pomeloClient.request(reqRoute, payload, (applyForMembershipRes) => {
            applyForMembershipRes.success.should.equal(false)
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
          const level = 'member'

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
          const level = 'member'

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
                    approveDenyMembershipApplicationRes.code.should.equal(500)
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
          const requestorLevel = 'member'
          const level = 'member'

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
                      approveDenyMembershipApplicationRes.code.should.equal(500)
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
                level: 'member',
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
            level: 'member',
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

                helper.createMembership(
                  self.pomeloClient, gameId, playerId, clanId, 'member', memberId,
                (membershipRes) => {
                  membershipRes.success.should.equal(true)

                  const reqRoute = 'metagame.sampleHandler.inviteForMembership'
                  const payload = {
                    gameID: gameId,
                    publicID: clanId,
                    level: 'member',
                    playerPublicID: inviteeId,
                    requestorPublicID: memberId,
                  }
                  self.pomeloClient.request(reqRoute, payload, (inviteForMembershipRes) => {
                    inviteForMembershipRes.success.should.equal(false)
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

    describe('Membership invitation should be', () => {
      const tests = [
        { descr: 'approved', action: 'approve' },
        { descr: 'denied', action: 'deny' },
      ]
      tests.forEach(test => {
        it(test.descr, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const inviteeId = helper.getRandomId()
          const clanId = helper.getRandomId()
          const level = 'elder'

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, inviteeId, playerId,
              (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
                  clanRes.success.should.equal(true)

                  helper.createMembershipInvitation(self.pomeloClient, gameId, clanId, level,
                  playerId, inviteeId, (invitationRes) => {
                    invitationRes.success.should.equal(true)

                    const reqRoute = 'metagame.sampleHandler.approveDenyMembershipInvitation'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      playerPublicID: inviteeId,
                    }
                    self.pomeloClient.request(reqRoute, payload,
                    (approveDenyMembershipInvitationRes) => {
                      approveDenyMembershipInvitationRes.success.should.equal(true)
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

    describe('Membership invitation should not be', () => {
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
          const inviteeId = helper.getRandomId()
          const clanId = helper.getRandomId()
          const requestorLevel = 'member'

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

                    const reqRoute = 'metagame.sampleHandler.approveDenyMembershipInvitation'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      playerPublicID: inviteeId,
                    }
                    self.pomeloClient.request(reqRoute, payload,
                    (approveDenyMembershipInvitationRes) => {
                      approveDenyMembershipInvitationRes.success.should.equal(false)
                      approveDenyMembershipInvitationRes.code.should.equal(500)
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

    describe('Promotion and demotion should succeed when', () => {
      const tests = [
        { descr: 'leader promotes', action: 'promote' },
        { descr: 'leader demotes player above minLevel', action: 'demote' },
      ]
      tests.forEach(test => {
        it(`${test.descr}`, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const memberId = helper.getRandomId()
          const clanId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, memberId, memberId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
                  clanRes.success.should.equal(true)

                  let level = 'member'
                  if (test.action === 'demote') {
                    level = 'elder'
                  }
                  helper.createMembership(self.pomeloClient, gameId, playerId, clanId, level,
                  memberId, (memRes) => {
                    memRes.success.should.equal(true)

                    const reqRoute = 'metagame.sampleHandler.promoteDemoteMember'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      playerPublicID: memberId,
                      requestorPublicID: playerId,
                    }
                    self.pomeloClient.request(reqRoute, payload, (promoteDemoteMember) => {
                      promoteDemoteMember.success.should.equal(true)
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


    describe('Promotion and demotion should fail when', () => {
      const tests = [
        { descr: 'leader promotes at max level', action: 'promote' },
        { descr: 'leader demotes player at minLevel', action: 'demote' },
      ]
      tests.forEach(test => {
        it(`${test.descr}`, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const memberId = helper.getRandomId()
          const clanId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, memberId, memberId, (applicantRes) => {
                applicantRes.success.should.equal(true)

                helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                (clanRes) => {
                  clanRes.success.should.equal(true)

                  let level = 'coleader'
                  if (test.action === 'demote') {
                    level = 'member'
                  }
                  helper.createMembership(self.pomeloClient, gameId, playerId, clanId, level,
                  memberId, (memRes) => {
                    memRes.success.should.equal(true)

                    const reqRoute = 'metagame.sampleHandler.promoteDemoteMember'
                    const payload = {
                      gameID: gameId,
                      publicID: clanId,
                      action: test.action,
                      playerPublicID: memberId,
                      requestorPublicID: playerId,
                    }
                    self.pomeloClient.request(reqRoute, payload, (promoteDemoteMember) => {
                      promoteDemoteMember.success.should.equal(false)
                      promoteDemoteMember.code.should.equal(500)
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

    describe('Promotion and demotion should succeed when', () => {
      const tests = [
        { descr: 'high level player promotes low level', action: 'promote' },
        { descr: 'high level player demotes mid level', action: 'demote' },
      ]
      tests.forEach(test => {
        it(`${test.descr}`, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const highLvId = helper.getRandomId()
          const memberId = helper.getRandomId()
          const clanId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, highLvId, highLvId, (highLvRes) => {
                highLvRes.success.should.equal(true)

                helper.createPlayer(self.pomeloClient, gameId, memberId, memberId,
                (applicantRes) => {
                  applicantRes.success.should.equal(true)

                  helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                  (clanRes) => {
                    clanRes.success.should.equal(true)

                    helper.createMembership(self.pomeloClient, gameId, playerId, clanId, 'coleader',
                    highLvId, (hiRes) => {
                      hiRes.success.should.equal(true)
                      let level = 'member'
                      if (test.action === 'demote') {
                        level = 'elder'
                      }
                      helper.createMembership(self.pomeloClient, gameId, playerId, clanId, level,
                      memberId, (memRes) => {
                        memRes.success.should.equal(true)

                        const reqRoute = 'metagame.sampleHandler.promoteDemoteMember'
                        const payload = {
                          gameID: gameId,
                          publicID: clanId,
                          action: test.action,
                          playerPublicID: memberId,
                          requestorPublicID: highLvId,
                        }
                        self.pomeloClient.request(reqRoute, payload, (promoteDemoteMember) => {
                          promoteDemoteMember.success.should.equal(true)
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

    describe('Promotion and demotion should fail when', () => {
      const tests = [
        { descr: 'high level player promotes mid level', action: 'promote' },
        { descr: 'high level player demotes high level', action: 'demote' },
      ]
      tests.forEach(test => {
        it(`${test.descr}`, function (done) {
          const self = this
          const gameId = helper.getRandomId()
          const playerId = helper.getRandomId()
          const highLvId = helper.getRandomId()
          const memberId = helper.getRandomId()
          const clanId = helper.getRandomId()

          helper.createGame(self.pomeloClient, gameId, gameId, (res) => {
            res.success.should.equal(true)

            helper.createPlayer(self.pomeloClient, gameId, playerId, playerId, (playerRes) => {
              playerRes.success.should.equal(true)

              helper.createPlayer(self.pomeloClient, gameId, highLvId, highLvId, (highLvRes) => {
                highLvRes.success.should.equal(true)

                helper.createPlayer(self.pomeloClient, gameId, memberId, memberId,
                (applicantRes) => {
                  applicantRes.success.should.equal(true)

                  helper.createClan(self.pomeloClient, gameId, playerId, clanId, clanId,
                  (clanRes) => {
                    clanRes.success.should.equal(true)

                    helper.createMembership(self.pomeloClient, gameId, playerId, clanId, 'coleader',
                    highLvId, (hiRes) => {
                      hiRes.success.should.equal(true)
                      let level = 'elder'
                      if (test.action === 'demote') {
                        level = 'coleader'
                      }
                      helper.createMembership(self.pomeloClient, gameId, playerId, clanId, level,
                      memberId, (memRes) => {
                        memRes.success.should.equal(true)

                        const reqRoute = 'metagame.sampleHandler.promoteDemoteMember'
                        const payload = {
                          gameID: gameId,
                          publicID: clanId,
                          action: test.action,
                          playerPublicID: memberId,
                          requestorPublicID: highLvId,
                        }
                        self.pomeloClient.request(reqRoute, payload, (promoteDemoteMember) => {
                          promoteDemoteMember.success.should.equal(false)
                          promoteDemoteMember.code.should.equal(500)
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
  })
})
