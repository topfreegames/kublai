// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const request = require('request')
const url = require('url')

const KhanService = function (khanUrl, app, component) {
  this.khanUrl = khanUrl
  this.app = app
  this._component = component  // eslint-disable-line no-underscore-dangle
}

module.exports = function (khanUrl, app, component) {
  return new KhanService(khanUrl, app, component)
}

function isFunction(functionToCheck) {
  const getType = {}
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

const buildPayloadWithMetadata = (opts) => {
  const payload = Object.assign({}, opts)
  payload.metadata = JSON.stringify(opts.metadata)
  return payload
}

KhanService.prototype.sendJsonRequest = function (method, uri, payload, callback) {
  if (isFunction(payload)) {
    callback = payload  // eslint-disable-line no-param-reassign
  }

  const khanUrl = url.resolve(this.khanUrl, uri)

  request({
    method,
    url: khanUrl,
    json: true,
    body: payload,
  }, (error, response, body) => {
    if (!error) {
      if (response.statusCode < 399) {
        callback(null, body)
        return
      }
      callback(`Could not process request: ${body.reason}`, null)
      return
    }
    callback(error, null)
  })
}

KhanService.prototype.createGame = function (opts, callback) {
  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('POST', '/games', payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updateGame = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include publicID in your payload.', null)
    return
  }

  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('PUT', `/games/${gameId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createPlayer = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('POST', `/games/${gameId}/players`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updatePlayer = function (gameId, playerId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!playerId) {
    callback('No playerId id was provided. Please include publicID in your payload.', null)
    return
  }

  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('PUT', `/games/${gameId}/players/${playerId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createClan = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }

  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('POST', `/games/${gameId}/clans`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updateClan = function (gameId, clanId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }

  const payload = buildPayloadWithMetadata(opts)

  this.sendJsonRequest('PUT', `/games/${gameId}/clans/${clanId}`, payload, (error, res) => {
    callback(error, res)
  })
}
