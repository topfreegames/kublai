// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

function InvalidRequestError(url, reason) {
  Error.captureStackTrace(this)
  this.type = 'InvalidRequest';
  this.message = 'The request for ' + url + ' could not be fullfilled because of ' + reason;
  this.code = 500;
}
InvalidRequestError.prototype = new Error()
InvalidRequestError.prototype.constructor = InvalidRequestError

module.exports = {
  InvalidRequestError: InvalidRequestError
}
