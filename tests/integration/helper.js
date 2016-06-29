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

function createGame(client, publicId, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createGame'
  const payload = {
    publicId,
    name,
    metadata: {},
    minLevelToAcceptApplication: 1,
    minLevelToCreateInvitation: 2,
    minLevelOffsetToPromoteMember: 2,
    minLevelOffsetToDemoteMember: 1,
    minLevelOffsetToRemoveMember: 1,
    minLevelToRemoveMember: 3,
    maxMembers: 30,
    membershipLevels: { member: 1, elder: 2, coleader: 3 },
    maxClansPerPlayer: 1,
  }

  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

function createPlayer(client, gameId, publicId, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createPlayer'
  const payload = {
    gameId,
    publicId,
    name,
    metadata: {},
  }

  client.request(reqRoute, payload, (res) => {
    cb(res)
  })
}

function createClan(client, gameId, ownerId, publicId, name, cb) {
  const reqRoute = 'metagame.sampleHandler.createClan'
  const payload = {
    gameId,
    publicId,
    ownerPublicId: ownerId,
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
    gameId,
    publicId: clanId,
    level,
    playerPublicId: applicantId,
  }
  client.request(reqRoute, payload, (applyForMembershipRes) => {
    cb(applyForMembershipRes)
  })
}

function acceptOrDenyMembership(client, gameId, ownerId, clanId, level, action, applicantId, cb) {
  createMembershipApplication(client, gameId, clanId, level, applicantId, () => {
    const approveRoute = 'metagame.sampleHandler.approveDenyMembershipApplication'
    const approvepayload = {
      gameId,
      publicId: clanId,
      action,
      level,
      playerPublicId: applicantId,
      requestorPublicId: ownerId,
    }
    client.request(approveRoute, approvepayload, (approveDenyMembershipApplicationRes) => {
      cb(approveDenyMembershipApplicationRes)
    })
  })
}

function createMembership(client, gameId, ownerId, clanId, level, applicantId, cb) {
  acceptOrDenyMembership(client, gameId, ownerId, clanId, level, 'approve', applicantId, cb)
}

function createPlayerAndMembership(client, gameId, ownerId, clanId, level, applicantId, cb) {
  createPlayer(client, gameId, applicantId, applicantId, () => {
    acceptOrDenyMembership(client, gameId, ownerId, clanId, level, 'approve', applicantId, cb)
  })
}

function createMembershipInvitation(client, gameId, clanId, level, requestorId, inviteeId, cb) {
  const reqRoute = 'metagame.sampleHandler.inviteForMembership'
  const payload = {
    gameId,
    publicId: clanId,
    level,
    playerPublicId: inviteeId,
    requestorPublicId: requestorId,
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
  createPlayerAndMembership,
}
