// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')

describe('Integration', function () {
  describe('Test Handler', function () {
    it('Should create game', function (done) {
      var reqRoute = 'metagame.sampleHandler.createGame'
      var payload = {
        publicID: 'test-id',
        name: 'test-name',
        metadata: {},
        minMembershipLevel: 1,
        maxMembershipLevel: 5,
        minLevelToAcceptApplication: 1,
        minLevelToCreateInvitation: 2,
        minLevelOffsetToPromoteMember: 3,
        minLevelToCreateInvitation: 4,
        allowApplication: true
      }

      this.pomeloClient.request(reqRoute, payload, function (res) {
        res.success.should.equal(true)
        done()
      })
    })
  })
})
