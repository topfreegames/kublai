// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const Event = function (app) {
  this.app = app
}

module.exports = function (app) {
  return new Event(app)
}

// Event.prototype.add_servers = function(servers) {
  // console.log('add', servers)
// }

// Event.prototype.remove_servers = function(ids) {
  // console.log('remove', ids)
// }

// Event.prototype.replace_servers = function(servers) {
  // console.log('replace', servers)
// }

// Event.prototype.bind_session = function(session) {
  // console.log('bind', session)
// }

// Event.prototype.close_session = function(session) {
  // console.log('close', session)
// }
