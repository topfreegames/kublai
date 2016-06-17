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

Handler.prototype.createGame = function(msg, session, next) {
  this.kublaiService.createGame(msg, function(error, game) {
    if (error) {
      next(error, { success: false, reason: error.toString() })
      return
    }
    next(null, { success: true, game: game.id })
  })
}

module.exports = function (app) {
  return new Handler(app)
}
