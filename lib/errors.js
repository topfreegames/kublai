// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const KhanError = function (message, meta) {
  Error.captureStackTrace(this)
  this.message = message
  this.meta = meta || {}
  this.khan = true
}
KhanError.prototype = new Error()
KhanError.prototype.constructor = KhanError

module.exports = { KhanError }
