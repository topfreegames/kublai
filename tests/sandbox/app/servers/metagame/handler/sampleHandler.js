// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

var Handler = function (app) {
  this.app = app
  this.kublaiService = this.app.get('kublai')
}

function handleKhanResponse(next) {
  return function(error, res) {
    if (error) {
      next(error, { success: false, reason: error.toString() })
    } else {
      next(null, res)
    }
  }
}

Handler.prototype.createGame = function(msg, session, next) {
  this.kublaiService.createGame(msg, handleKhanResponse(next))
}

Handler.prototype.updateGame = function(msg, session, next) {
  this.kublaiService.updateGame(msg.publicID, msg, handleKhanResponse(next))
}

Handler.prototype.createClan= function(msg, session, next) {
  this.kublaiService.createClan(msg.publicID, msg, handleKhanResponse(next))
}


module.exports = function (app) {
  return new Handler(app)
}
