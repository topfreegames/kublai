// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const utils = require('pomelo/lib/util/utils')
const KublaiService = require('../services/kublai.js')

const Component = function (app, opts) {
  if (!opts.khanUrl) {
    throw new Error('Could not load kublai since no khan url was specified...')
  }
  this.app = app
  this.app.set('kublai', new KublaiService(opts.khanUrl, this.app, this))
}

Component.prototype.start = (cb) => {
  utils.invokeCallback(cb)
}

module.exports = function (app, opts) {
  return new Component(app, opts)
}
