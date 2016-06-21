// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')
var uuid = require('node-uuid');

function getRandomId() {
  return uuid.v4();
}

function createGame(client, id, name, cb) {
  var reqRoute = 'metagame.sampleHandler.createGame'
  var payload = {
    publicID: id,
    name: name,
    metadata: {},
    minMembershipLevel: 1,
    maxMembershipLevel: 5,
    minLevelToAcceptApplication: 1,
    minLevelToCreateInvitation: 2,
    minLevelOffsetToPromoteMember: 3,
    minLevelOffsetToDemoteMember: 3,
    minLevelToRemoveMember: 3,
    minLevelToCreateInvitation: 4,
    allowApplication: true,
    maxMembers: 30
  }

  client.request(reqRoute, payload, function (res) {
    cb(res)
  })
}

describe('Integration', function () {
  describe('Game Test Handler', function () {
    it('Should create game', function (done) {
      createGame(this.pomeloClient, 'test-id', 'test-name', function(res) {
        res.success.should.equal(true)
        res.publicID.should.not.equal(0)
        done()
      })
    })

    it('Should update game', function (done) {
      var self = this;
      var id = getRandomId()

      createGame(self.pomeloClient, id, id, function(res) {
        res.success.should.equal(true);
        var gameId = res.id;

        var reqRoute = 'metagame.sampleHandler.updateGame'
        var updatePayload = {
          publicID: id,
          name: id,
          metadata: {},
          minMembershipLevel: 2,
          maxMembershipLevel: 6,
          minLevelToAcceptApplication: 2,
          minLevelToCreateInvitation: 3,
          minLevelOffsetToPromoteMember: 4,
          minLevelOffsetToDemoteMember: 4,
          minLevelToRemoveMember: 4,
          minLevelToCreateInvitation: 5,
          allowApplication: false,
          maxMembers: 20
        }

        self.pomeloClient.request(reqRoute, updatePayload, function (res) {
          res.success.should.equal(true)
          done()
        })
      })
    })
  })

  //describe('Clan Test Handler', function () {
    //beforeEach(function(done) {
      //createGame(self.pomeloClient, 'test-id-' + getRandomId(), 'test-name-' + getRandomId(), function(res) {
        //res.success.should.equal(true);
        //this.gameId = res.gameId;
      //})
    //})

    //it('Should create clan', function (done) {
      //var reqRoute = 'metagame.sampleHandler.createClan'
      //self.pomeloClient.request(reqRoute, updatePayload, function (res) {
        //res.success.should.equal(true)
        //done()
      //})
    //})
  //})
})
