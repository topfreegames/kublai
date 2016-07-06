// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const Handler = function (app) {
  this.app = app
  this.kublaiService = this.app.get('kublai')
}

function handleKhanResponse(next) {
  return (error, res) => {
    if (error) {
      next(error, { success: false, reason: error.toString() })
    } else {
      next(null, res)
    }
  }
}

Handler.prototype.createGame = function (msg, session, next) {
  const callback = handleKhanResponse(next)
  this.kublaiService.createGame(
    msg.publicId,
    msg.name,
    msg.metadata,
    msg.membershipLevels,
    msg.minLevelToAcceptApplication,
    msg.minLevelToCreateInvitation,
    msg.minLevelToRemoveMember,
    msg.minLevelOffsetToRemoveMember,
    msg.minLevelOffsetToPromoteMember,
    msg.minLevelOffsetToDemoteMember,
    msg.maxMembers,
    msg.maxClansPerPlayer,
    callback
  )
}

Handler.prototype.updateGame = function (msg, session, next) {
  const callback = handleKhanResponse(next)
  this.kublaiService.updateGame(
    msg.publicId,
    msg.name,
    msg.metadata,
    msg.membershipLevels,
    msg.minLevelToAcceptApplication,
    msg.minLevelToCreateInvitation,
    msg.minLevelToRemoveMember,
    msg.minLevelOffsetToRemoveMember,
    msg.minLevelOffsetToPromoteMember,
    msg.minLevelOffsetToDemoteMember,
    msg.maxMembers,
    msg.maxClansPerPlayer,
    callback
  )
}

Handler.prototype.createPlayer = function (msg, session, next) {
  this.kublaiService.createPlayer(
    msg.gameId, msg.publicId, msg.name, msg.metadata, handleKhanResponse(next)
  )
}

Handler.prototype.updatePlayer = function (msg, session, next) {
  this.kublaiService.updatePlayer(
    msg.gameId, msg.publicId, msg.name, msg.metadata, handleKhanResponse(next)
  )
}

Handler.prototype.getPlayer = function (msg, session, next) {
  this.kublaiService.getPlayer(msg.gameId, msg.publicId, handleKhanResponse(next))
}

Handler.prototype.createClan = function (msg, session, next) {
  this.kublaiService.createClan(
    msg.gameId, msg.publicId, msg.name, msg.metadata,
    msg.ownerPublicId, msg.allowApplication, msg.autoJoin,
    handleKhanResponse(next)
  )
}

Handler.prototype.updateClan = function (msg, session, next) {
  this.kublaiService.updateClan(
    msg.gameId, msg.publicId, msg.name, msg.metadata,
    msg.ownerPublicId, msg.allowApplication, msg.autoJoin,
    handleKhanResponse(next)
  )
}

Handler.prototype.getClanSummary = function (msg, session, next) {
  this.kublaiService.getClanSummary(msg.gameId, msg.publicId, handleKhanResponse(next))
}

Handler.prototype.getClan = function (msg, session, next) {
  this.kublaiService.getClan(msg.gameId, msg.publicId, handleKhanResponse(next))
}

Handler.prototype.leaveClan = function (msg, session, next) {
  // Here maybe you should check if the current player is the current clan owner ;)
  this.kublaiService.leaveClan(
    msg.gameId, msg.publicId, handleKhanResponse(next)
  )
}

Handler.prototype.listClans = function (msg, session, next) {
  this.kublaiService.listClans(msg.gameId, handleKhanResponse(next))
}

Handler.prototype.applyForMembership = function (msg, session, next) {
  this.kublaiService.applyForMembership(
    msg.gameId, msg.publicId, msg.level, msg.playerPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.approveDenyMembershipApplication = function (msg, session, next) {
  this.kublaiService.approveDenyMembershipApplication(
    msg.gameId, msg.publicId, msg.action, msg.playerPublicId,
    msg.requestorPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.inviteForMembership = function (msg, session, next) {
  this.kublaiService.inviteForMembership(
    msg.gameId, msg.publicId, msg.level, msg.playerPublicId,
    msg.requestorPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.approveDenyMembershipInvitation = function (msg, session, next) {
  this.kublaiService.approveDenyMembershipInvitation(
    msg.gameId, msg.publicId, msg.action, msg.playerPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.promoteDemoteMember = function (msg, session, next) {
  this.kublaiService.promoteDemoteMember(
    msg.gameId, msg.publicId, msg.action, msg.playerPublicId,
    msg.requestorPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.deleteMembership = function (msg, session, next) {
  this.kublaiService.deleteMembership(
    msg.gameId, msg.publicId, msg.playerPublicId,
    msg.requestorPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.searchClans = function (msg, session, next) {
  this.kublaiService.searchClans(
    msg.gameId, msg.term, handleKhanResponse(next)
  )
}

Handler.prototype.transferClanOwnership = function (msg, session, next) {
  this.kublaiService.transferClanOwnership(
    msg.gameId, msg.clanId, msg.playerPublicId, handleKhanResponse(next)
  )
}

Handler.prototype.createHook = function (msg, session, next) {
  this.kublaiService.createHook(
    msg.gameId, msg.hookType, msg.hookURL, handleKhanResponse(next)
  )
}

Handler.prototype.removeHook = function (msg, session, next) {
  this.kublaiService.removeHook(
    msg.gameId, msg.publicId, handleKhanResponse(next)
  )
}

module.exports = function (app) {
  return new Handler(app)
}
