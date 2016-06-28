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
  this.kublaiService.createGame(msg, handleKhanResponse(next))
}

Handler.prototype.updateGame = function (msg, session, next) {
  this.kublaiService.updateGame(msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.createPlayer = function (msg, session, next) {
  this.kublaiService.createPlayer(msg.gameID, msg, handleKhanResponse(next))
}

Handler.prototype.updatePlayer = function (msg, session, next) {
  this.kublaiService.updatePlayer(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.getPlayer = function (msg, session, next) {
  this.kublaiService.getPlayer(msg.gameID, msg.publicID, handleKhanResponse(next))
}

Handler.prototype.createClan = function (msg, session, next) {
  this.kublaiService.createClan(msg.gameID, msg, handleKhanResponse(next))
}

Handler.prototype.updateClan = function (msg, session, next) {
  this.kublaiService.updateClan(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.getClan = function (msg, session, next) {
  this.kublaiService.getClan(msg.gameID, msg.publicID, handleKhanResponse(next))
}

Handler.prototype.leaveClan = function (msg, session, next) {
  // Here maybe you should check if the current player is the current clan owner ;)
  this.kublaiService.leaveClan(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.listClans = function (msg, session, next) {
  this.kublaiService.listClans(msg.gameID, handleKhanResponse(next))
}

Handler.prototype.applyForMembership = function (msg, session, next) {
  this.kublaiService.applyForMembership(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.approveDenyMembershipApplication = function (msg, session, next) {
  this.kublaiService.approveDenyMembershipApplication(
    msg.gameID, msg.publicID, msg.action, msg, handleKhanResponse(next)
  )
}

Handler.prototype.inviteForMembership = function (msg, session, next) {
  this.kublaiService.inviteForMembership(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.approveDenyMembershipInvitation = function (msg, session, next) {
  this.kublaiService.approveDenyMembershipInvitation(
    msg.gameID, msg.publicID, msg.action, msg, handleKhanResponse(next)
  )
}

module.exports = function (app) {
  return new Handler(app)
}
