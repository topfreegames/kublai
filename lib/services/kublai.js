// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

var url = require('url');
var request = require('request');

module.exports = function(khanUrl, app, component) {
  return new KhanService(khanUrl, app, component);
};

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var KhanService = function(khanUrl, app, component) {
  this.khanUrl = khanUrl
  this.app = app
  this._component = component
};

KhanService.prototype.sendJsonRequest = function(method, uri, payload, callback) {
  if (isFunction(payload)) {
    callback = payload;
  }

  var khanUrl = url.resolve(this.khanUrl, uri);

  request({
    method: method,
    url: khanUrl,
    json: true,
    body: payload
  }, function(error, response, body) {
    if (!error) {
      if (response.statusCode < 399) {
        return callback(null, body);
      }
      return callback("Could not process request: " + body.reason, null);
    }
    callback(error, null);
  })
}

KhanService.prototype.createGame = function(opts, callback) {
  payload = Object.assign({}, opts)
  payload.metadata = JSON.stringify(opts.metadata)

  this.sendJsonRequest('POST', '/games', payload, function(error, res) {
    callback(error, res)
  })
}

KhanService.prototype.updateGame = function(gameId, opts, callback) {
  if (!gameId) {
    return callback('No game id was provided. Please include publicID in your payload.', null)
  }

  payload = Object.assign({}, opts)
  payload.metadata = JSON.stringify(opts.metadata)

  this.sendJsonRequest('PUT', `/games/${gameId}`, payload, function(error, res) {
    callback(error, res)
  })
}

KhanService.prototype.createPlayer = function(gameId, opts, callback) {
  payload = Object.assign({}, opts)
  payload.metadata = JSON.stringify(opts.metadata)

  this.sendJsonRequest('POST', `/games/${gameId}/players`, payload, function(error, res) {
    callback(error, res)
  })
}

KhanService.prototype.updatePlayer = function(gameId, playerId, opts, callback) {
  if (!gameId) {
    return callback('No game id was provided. Please include gameID in your payload.', null)
  }
  if (!playerId) {
    return callback('No playerId id was provided. Please include publicID in your payload.', null)
  }

  payload = Object.assign({}, opts)
  payload.metadata = JSON.stringify(opts.metadata)

  this.sendJsonRequest('PUT', `/games/${gameId}/players/${playerId}`, payload, function(error, res) {
    callback(error, res)
  })
}

KhanService.prototype.createClan = function(gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameId in your payload.', null)
  }

  payload = {
    publicID: opts.publicID,
    name: opts.name,
    metadata: JSON.stringify(opts.metadata),
    ownerPublicID: "owner-" + getRandomId(),
    allowApplication: true,
    autoJoin: true
  }

  this.sendJsonRequest('PUT', '/games/' + opts.gameId + '/clans', payload, function(error, res) {
    callback(error, res)
  })
}
