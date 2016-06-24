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

function acceptOrDenyMembership(client, gameId, ownerId, clanId, level, action, applicantId, cb) {
  createMembershipApplication(client, gameId, clanId, level, applicantId, () => {
    const approveRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
    const approvepayload = {
      gameID: gameId,
      publicID: clanId,
      action,
      level,
      playerPublicID: applicantId,
      requestorPublicID: ownerId,
    }
    client.request(approveRoute, approvepayload, (approveDenyMembershipApplicationRes) => {
      cb(approveDenyMembershipApplicationRes)
    })
  })
}

function createMembership(client, gameId, ownerId, clanId, level, applicantId, cb) {
  acceptOrDenyMembership(client, gameId, ownerId, clanId, level, 'approve', applicantId, cb)
}

function createMembershipInvitation(client, gameId, clanId, level, requestorId, inviteeId, cb) {
  const reqRoute = 'metagame.sampleHandler.inviteForMembership'
  const payload = {
    gameID: gameId,
    publicID: clanId,
    level,
    playerPublicID: inviteeId,
    requestorPublicID: requestorId,
  }
  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

module.exports = {
  getRandomId,
  createGame,
  createPlayer,
  createClan,
  createMembershipApplication,
  acceptOrDenyMembership,
  createMembership,
  createMembershipInvitation,
}
