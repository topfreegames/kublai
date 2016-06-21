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

function createPlayer(client, gameId, id, name, cb) {
  var reqRoute = 'metagame.sampleHandler.createPlayer'
  var payload = {
    gameID: gameId,
    publicID: id,
    name: name,
    metadata: {},
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
        res.publicID.should.equal('test-id')
        done()
      })
    })

    it('Should update game', function (done) {
      var self = this;
      var id = getRandomId()

      createGame(self.pomeloClient, id, id, function(res) {
        res.success.should.equal(true);
        var gameId = res.publicID;

        var reqRoute = 'metagame.sampleHandler.updateGame'
        var updatePayload = {
          publicID: gameId,
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

    it('Should not update game is missing gameId', function (done) {
      var self = this;
      var id = getRandomId()

      createGame(self.pomeloClient, id, id, function(res) {
        res.success.should.equal(true);

        var reqRoute = 'metagame.sampleHandler.updateGame'
        var updatePayload = {
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
          res.success.should.equal(false)
          res.reason.should.equal('No game id was provided. Please include publicID in your payload.')
          done()
        })
      })
    })
  })

  describe('Player Test Handler', function () {
    it('Should create player', function (done) {
      var self = this
      var gameId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, function(res) {
        res.success.should.equal(true);

        createPlayer(self.pomeloClient, gameId, 'player-id', 'player-name', function(res) {
          res.success.should.equal(true)
          res.publicID.should.equal('player-id')
          done()
        })
      })
    })

    it('Should update player', function (done) {
      var self = this;
      var gameId = getRandomId()
      var playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, function(res) {
        res.success.should.equal(true);

        createPlayer(self.pomeloClient, gameId, playerId, playerId, function(res) {
          res.success.should.equal(true)

          var reqRoute = 'metagame.sampleHandler.updatePlayer'
          var updatePayload = {
            gameID: gameId,
            publicID: playerId,
            name: playerId,
            metadata: {new: "metadata"},
          }

          self.pomeloClient.request(reqRoute, updatePayload, function (res) {
            res.success.should.equal(true)
            done()
          })
        })
      })
    })

    it('Should not update players is missing gameId', function (done) {
      var self = this;
      var gameId = getRandomId()
      var playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, function(res) {
        res.success.should.equal(true);

        createPlayer(self.pomeloClient, gameId, playerId, playerId, function(res) {
          res.success.should.equal(true)

          var reqRoute = 'metagame.sampleHandler.updatePlayer'
          var updatePayload = {
            publicID: playerId,
            name: playerId,
            metadata: {new: "metadata"},
          }

          self.pomeloClient.request(reqRoute, updatePayload, function (res) {
            res.success.should.equal(false)
            res.reason.should.equal('No game id was provided. Please include gameID in your payload.')
            done()
          })
        })
      })
    })

    it('Should not update players is missing playerId', function (done) {
      var self = this;
      var gameId = getRandomId()
      var playerId = getRandomId()

      createGame(self.pomeloClient, gameId, gameId, function(res) {
        res.success.should.equal(true);

        createPlayer(self.pomeloClient, gameId, playerId, playerId, function(res) {
          res.success.should.equal(true)

          var reqRoute = 'metagame.sampleHandler.updatePlayer'
          var updatePayload = {
            gameID: gameId,
            name: playerId,
            metadata: {new: "metadata"},
          }

          self.pomeloClient.request(reqRoute, updatePayload, function (res) {
            res.success.should.equal(false)
            res.reason.should.equal('No playerId id was provided. Please include publicID in your payload.')
            done()
          })
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
