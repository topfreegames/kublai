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

KhanService.prototype.createGame = function (
  publicId,
  name,
  metadata,
  membershipLevels,
  minLevelToAcceptApplication,
  minLevelToCreateInvitation,
  minLevelToRemoveMember,
  minLevelOffsetToRemoveMember,
  minLevelOffsetToPromoteMember,
  minLevelOffsetToDemoteMember,
  maxMembers,
  maxClansPerPlayer,
  callback
) {
  const payload = {
    publicID: publicId,
    name,
    metadata,
    membershipLevels,
    minLevelToAcceptApplication,
    minLevelToCreateInvitation,
    minLevelToRemoveMember,
    minLevelOffsetToRemoveMember,
    minLevelOffsetToPromoteMember,
    minLevelOffsetToDemoteMember,
    maxMembers,
    maxClansPerPlayer,
  }

  this.sendJsonRequest('POST', '/games', payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updateGame = function (
  publicId,
  name,
  metadata,
  membershipLevels,
  minLevelToAcceptApplication,
  minLevelToCreateInvitation,
  minLevelToRemoveMember,
  minLevelOffsetToRemoveMember,
  minLevelOffsetToPromoteMember,
  minLevelOffsetToDemoteMember,
  maxMembers,
  maxClansPerPlayer,
  callback) {
  if (!publicId) {
    callback('No game id was provided. Please include publicID in your payload.', null)
    return
  }

  const payload = {
    publicID: publicId,
    name,
    metadata,
    membershipLevels,
    minLevelToAcceptApplication,
    minLevelToCreateInvitation,
    minLevelToRemoveMember,
    minLevelOffsetToRemoveMember,
    minLevelOffsetToPromoteMember,
    minLevelOffsetToDemoteMember,
    maxMembers,
    maxClansPerPlayer,
  }

  this.sendJsonRequest('PUT', `/games/${publicId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createPlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!publicId) {
    callback('No player id was provided.', null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }
  this.sendJsonRequest('POST', `/games/${gameId}/players`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updatePlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!publicId) {
    callback('No player id was provided.', null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }

  this.sendJsonRequest('PUT', `/games/${gameId}/players/${publicId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getPlayer = function (gameId, playerId, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!playerId) {
    callback('No player id was provided.', null)
    return
  }
  this.sendJsonRequest('GET', `/games/${gameId}/players/${playerId}`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createClan = function (
  gameId,
  publicId,
  name,
  metadata,
  ownerPublicId,
  allowApplication,
  autoJoin,
  callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }

  const payload = {
    publicID: publicId,
    name,
    metadata,
    ownerPublicID: ownerPublicId,
    allowApplication,
    autoJoin,
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.updateClan = function (
  gameId,
  publicId,
  name,
  metadata,
  ownerPublicId,
  allowApplication,
  autoJoin,
  callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!publicId) {
    callback('No clan id was provided.', null)
    return
  }

  const payload = {
    publicID: publicId,
    name,
    metadata,
    ownerPublicID: ownerPublicId,
    allowApplication,
    autoJoin,
  }

  this.sendJsonRequest('PUT', `/games/${gameId}/clans/${publicId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getClan = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  this.sendJsonRequest('GET', `/games/${gameId}/clans/${clanId}`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getClanSummary = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  this.sendJsonRequest('GET', `/games/${gameId}/clans/${clanId}/summary`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.listClans = function (gameId, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }

  this.sendJsonRequest('GET', `/games/${gameId}/clans`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.searchClans = function (gameId, term, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!term) {
    callback('No search term was provided. Please include term in your payload.', null)
    return
  }

  this.sendJsonRequest(
    'GET',
    `/games/${gameId}/clan-search?term=${term}`,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.leaveClan = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/leave`, {}, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.transferClanOwnership = function (
  gameId, clanId, playerPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }
  if (!playerPublicId) {
    callback('No player id was provided.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/transfer-ownership`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.applyForMembership = function (
  gameId, clanId, level, playerPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  const payload = {
    level,
    playerPublicID: playerPublicId,
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/memberships/application`, payload,
  (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.approveDenyMembershipApplication = function (
  gameId, clanId, action, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Please include action in your payload.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/application/${action}`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.inviteForMembership = function (
  gameId, clanId, level, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  const payload = {
    level,
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest('POST', `/games/${gameId}/clans/${clanId}/memberships/invitation`, payload,
  (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.approveDenyMembershipInvitation = function (
  gameId, clanId, action, playerPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Please include action in your payload.', null)
    return
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/invitation/${action}`,
    { playerPublicID: playerPublicId },
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.promoteDemoteMember = function (
  gameId, clanId, action, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Please include action in your payload.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/${action}`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.deleteMembership = function (
  gameId, clanId, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/delete`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}
