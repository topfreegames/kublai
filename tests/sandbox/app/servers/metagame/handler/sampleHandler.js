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

Handler.prototype.createClan = function (msg, session, next) {
  this.kublaiService.createClan(msg.gameID, msg, handleKhanResponse(next))
}

Handler.prototype.updateClan = function (msg, session, next) {
  this.kublaiService.updateClan(msg.gameID, msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.getClan = function (msg, session, next) {
  this.kublaiService.getClan(msg.gameID, msg.publicID, handleKhanResponse(next))
}

module.exports = function (app) {
  return new Handler(app)
}
