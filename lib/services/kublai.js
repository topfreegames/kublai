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
        if (body.metadata && typeof body.metadata === 'string') {
          body.metadata = JSON.parse(body.metadata)  // eslint-disable-line no-param-reassign
        }
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
  this.sendJsonRequest('POST', '/games', opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updateGame = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include publicID in your payload.', null)
    return
  }

  this.sendJsonRequest('PUT', `/games/${gameId}`, opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createPlayer = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  this.sendJsonRequest('POST', `/games/${gameId}/players`, opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getPlayer = function (gameId, playerId, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!playerId) {
    callback('No clan id was provided. Please include clanID in your payload.', null)
    return
  }
  this.sendJsonRequest('GET', `/games/${gameId}/players/${playerId}`, (error, res) => {
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

  this.sendJsonRequest('PUT', `/games/${gameId}/players/${playerId}`, opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createClan = function (gameId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans`, opts, (error, res) => {
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

  this.sendJsonRequest('PUT', `/games/${gameId}/clans/${clanId}`, opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getClan = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }

  this.sendJsonRequest('GET', `/games/${gameId}/clans/${clanId}`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.leaveClan = function (gameId, clanId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/leave`, opts, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.applyForMembership = function (gameId, clanId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/memberships/application`, opts,
  (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.approveDenyMembershipApplication = function (
  gameId, clanId, action, opts, callback
) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Please include action in your payload.', null)
    return
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/application/${action}`,
    opts,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.inviteForMembership = function (gameId, clanId, opts, callback) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/memberships/invitation`, opts,
  (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.approveDenyMembershipInvitation = function (
  gameId, clanId, action, opts, callback
) {
  if (!gameId) {
    callback('No game id was provided. Please include gameID in your payload.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Please include publicID in your payload.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Please include action in your payload.', null)
    return
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/invitation/${action}`,
    opts,
    (error, res) => {
      callback(error, res)
    }
  )
}
