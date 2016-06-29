// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
const helper = require('./helper')

describe('Integration', () => {
  describe('Game Test Handler', () => {
    it('Should create game', function (done) {
      helper.createGame(this.pomeloClient, 'test-id', 'test-name', (res) => {
        res.success.should.equal(true)
        res.publicID.should.equal('test-id')
        done()
      })
    })

    it('Should update game', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)
        const gameId = res.publicID

        const reqRoute = 'metagame.sampleHandler.updateGame'
        const updatePayload = {
          publicId: gameId,
          name: id,
          metadata: {},
          minLevelToAcceptApplication: 2,
          minLevelToCreateInvitation: 3,
          minLevelOffsetToPromoteMember: 4,
          minLevelOffsetToDemoteMember: 4,
          minLevelOffsetToRemoveMember: 1,
          minLevelToRemoveMember: 4,
          allowApplication: false,
          maxMembers: 20,
          membershipLevels: { noob: 1, member: 2, elder: 3, coleader: 4 },
          maxClansPerPlayer: 2,
        }

        self.pomeloClient.request(reqRoute, updatePayload, (updateRes) => {
          updateRes.success.should.equal(true)
          done()
        })
      })
    })

    it('Should not update game is missing gameId', function (done) {
      const self = this
      const id = helper.getRandomId()

      helper.createGame(self.pomeloClient, id, id, (res) => {
        res.success.should.equal(true)

        const reqRoute = 'metagame.sampleHandler.updateGame'
        const updatePayload = {
          name: id,
          metadata: {},
          minLevelToAcceptApplication: 2,
          minLevelToCreateInvitation: 3,
          minLevelOffsetToPromoteMember: 4,
          minLevelOffsetToDemoteMember: 4,
          minLevelOffsetToRemoveMember: 1,
          minLevelToRemoveMember: 4,
          allowApplication: false,
          maxMembers: 20,
          membershipLevels: { noob: 1, member: 2, elder: 3, coleader: 4 },
          maxClansPerPlayer: 2,
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
})
