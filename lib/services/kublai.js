// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const request = require('request')
const url = require('url')

const gameOptionalParams = ['cooldownBeforeInvite', 'cooldownBeforeApply', 'maxPendingInvites']

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

KhanService.prototype.sendJsonRequest = function (operation, method, uri, payload, qs, callback) {
  if (isFunction(payload)) {
    callback = payload  // eslint-disable-line no-param-reassign
  } else if (isFunction(qs)) {
    callback = qs  // eslint-disable-line no-param-reassign
  }

  const khanUrl = url.resolve(this.khanUrl, uri)

  request({
    method,
    url: khanUrl,
    json: true,
    body: payload,
    qs,
  }, (error, response, body) => {
    if (!error) {
      if (response.statusCode < 399) {
        if (body.metadata && typeof body.metadata === 'string') {
          body.metadata = JSON.parse(body.metadata)  // eslint-disable-line no-param-reassign
        }
        callback(null, body)
        return
      }
      callback(`Could not process request: ${body.reason}. Operation: ${operation}.`, null)
      return
    }
    callback(error, null)
  })
}

KhanService.prototype.healthcheck = function (callback) {
  this.sendJsonRequest('healthcheck', 'GET', '/healthcheck', (error, res) => {
    callback(error, res)
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
  cooldownAfterDelete,
  cooldownAfterDeny,
  options,
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
    cooldownAfterDelete,
    cooldownAfterDeny,
  }

  if (options instanceof Function) {
    callback = options  // eslint-disable-line no-param-reassign
    options = {}        // eslint-disable-line no-param-reassign
  } else if (typeof options === 'object') {
    Object.keys(options).forEach(param => {
      if (gameOptionalParams.indexOf(param) > -1) {
        payload[param] = options[param]
      }
    })
  }

  this.sendJsonRequest('createGame', 'POST', '/games', payload, (error, res) => {
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
  cooldownAfterDelete,
  cooldownAfterDeny,
  options,
  callback) {
  if (options instanceof Function) {
    callback = options  // eslint-disable-line no-param-reassign
    options = {}        // eslint-disable-line no-param-reassign
  }

  if (!publicId) {
    callback('No game id was provided. Operation: updateGame.', null)
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
    cooldownAfterDelete,
    cooldownAfterDeny,
  }

  if (typeof options === 'object') {
    Object.keys(options).forEach(param => {
      if (gameOptionalParams.indexOf(param) > -1) {
        payload[param] = options[param]
      }
    })
  }

  this.sendJsonRequest('updateGame', 'PUT', `/games/${publicId}`, payload, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.createPlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: createPlayer.', null)
    return
  }
  if (!publicId) {
    callback('No player id was provided. Operation: createPlayer.', null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }
  this.sendJsonRequest('createPlayer', 'POST', `/games/${gameId}/players`, payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.updatePlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: updatePlayer.', null)
    return
  }
  if (!publicId) {
    callback('No player id was provided. Operation: updatePlayer.', null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }

  this.sendJsonRequest('updatePlayer', 'PUT', `/games/${gameId}/players/${publicId}`, payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.getPlayer = function (gameId, playerId, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: getPlayer.', null)
    return
  }
  if (!playerId) {
    callback('No player id was provided. Operation: getPlayer.', null)
    return
  }
  this.sendJsonRequest('getPlayer', 'GET', `/games/${gameId}/players/${playerId}`, (error, res) => {
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
    callback('No game id was provided. Operation: createClan.', null)
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

  this.sendJsonRequest('createClan', 'POST', `/games/${gameId}/clans`, payload, (error, res) => {
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
    callback('No game id was provided. Operation: updateClan.', null)
    return
  }
  if (!publicId) {
    callback('No clan id was provided. Operation: updateClan.', null)
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

  this.sendJsonRequest('updateClan', 'PUT', `/games/${gameId}/clans/${publicId}`, payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.getClan = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: getClan.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: getClan.', null)
    return
  }

  this.sendJsonRequest('getClan', 'GET', `/games/${gameId}/clans/${clanId}`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.getClanSummary = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: getClanSummary.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: getClanSummary.', null)
    return
  }

  this.sendJsonRequest('getClanSummary', 'GET', `/games/${gameId}/clans/${clanId}/summary`,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.listClansSummary = function (gameId, clanIds, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: listClansSummary.', null)
    return
  }
  if (!clanIds) {
    callback('No clan ids were provided. Operation: listClansSummary.', null)
    return
  }
  if (!(clanIds instanceof Array)) {
    callback('Bad clanIds provided, it must be an array. Operation: listClansSummary.', null)
    return
  }
  if (clanIds.length === 0) {
    callback('Empty clanIds provided, it must have length > 0. Operation: listClansSummary.', null)
    return
  }

  const qs = { clanPublicIds: clanIds.join(',') }
  this.sendJsonRequest('listClansSummary', 'GET', `/games/${gameId}/clans-summary`, undefined, qs,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.listClans = function (gameId, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: listClans.', null)
    return
  }

  this.sendJsonRequest('listClans', 'GET', `/games/${gameId}/clans`, (error, res) => {
    callback(error, res)
  })
}

KhanService.prototype.searchClans = function (gameId, term, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: searchClans.', null)
    return
  }
  if (!term) {
    callback('No search term was provided. Operation: searchClans.', null)
    return
  }

  this.sendJsonRequest(
    'searchClans',
    'GET',
    `/games/${gameId}/clan-search?term=${term}`,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.leaveClan = function (gameId, clanId, callback) {
  if (!gameId) {
    callback('No game id was provided. Operation: leaveClan.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: leaveClan.', null)
    return
  }

  this.sendJsonRequest('leaveClan', 'POST', `/games/${gameId}/clans/${clanId}/leave`, {},
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.transferClanOwnership = function (
  gameId, clanId, playerPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided. Operation: transferClanOwnership.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: transferClanOwnership.', null)
    return
  }
  if (!playerPublicId) {
    callback('No player id was provided. Operation: transferClanOwnership.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
  }

  this.sendJsonRequest(
    'transferClanOwnership',
    'POST',
    `/games/${gameId}/clans/${clanId}/transfer-ownership`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.applyForMembership = function (
  gameId, clanId, level, playerPublicId, message, callback
) {
  if (message instanceof Function) {
    callback = message  // eslint-disable-line no-param-reassign
    message = undefined  // eslint-disable-line no-param-reassign
  }
  if (!gameId) {
    callback('No game id was provided. Operation: applyForMembership.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: applyForMembership.', null)
    return
  }

  const payload = {
    level,
    playerPublicID: playerPublicId,
  }

  if (!!message) {
    payload.message = message
  }

  this.sendJsonRequest(
    'applyForMembership',
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/application`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.approveDenyMembershipApplication = function (
  gameId, clanId, action, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided. Operation: approveDenyMembershipApplication.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: approveDenyMembershipApplication.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Operation: approveDenyMembershipApplication.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'approveDenyMembershipApplication',
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/application/${action}`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.inviteForMembership = function (
  gameId, clanId, level, playerPublicId, requestorPublicId, message, callback
) {
  if (message instanceof Function) {
    callback = message  // eslint-disable-line no-param-reassign
    message = undefined  // eslint-disable-line no-param-reassign
  }
  if (!gameId) {
    callback('No game id was provided. Operation: inviteForMembership.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: inviteForMembership.', null)
    return
  }

  const payload = {
    level,
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  if (!!message) {
    payload.message = message
  }

  this.sendJsonRequest(
    'inviteForMembership',
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/invitation`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.approveDenyMembershipInvitation = function (
  gameId, clanId, action, playerPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided. Operation: approveDenyMembershipInvitation.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: approveDenyMembershipInvitation.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Operation: approveDenyMembershipInvitation.', null)
    return
  }

  this.sendJsonRequest(
    'approveDenyMembershipInvitation',
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
    callback('No game id was provided. Operation: promoteDemoteMember.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: promoteDemoteMember.', null)
    return
  }
  if (!action) {
    callback('No action was provided. Operation: promoteDemoteMember.', null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'promoteDemoteMember',
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
    callback('No game id was provided. Operation: deleteMembership.', null)
    return
  }
  if (!clanId) {
    callback('No clan id was provided. Operation: deleteMembership.', null)
    return
  }

  const payload = {
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'deleteMembership',
    'DELETE',
    `/games/${gameId}/clans/${clanId}/memberships/${playerPublicId}`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.createHook = function (
  gameId, hookType, hookURL, callback
) {
  if (!gameId) {
    callback('No game id was provided. Operation: createHook.', null)
    return
  }
  if (!hookType) {
    callback('No hook type was provided. Operation: createHook.', null)
    return
  }
  if (!hookURL) {
    callback('No hook URL was provided. Operation: createHook.', null)
    return
  }

  const payload = {
    type: hookType,
    hookURL,
  }

  this.sendJsonRequest(
    'createHook',
    'POST',
    `/games/${gameId}/hooks`,
    payload,
    (error, res) => {
      callback(error, res)
    }
  )
}

KhanService.prototype.removeHook = function (
  gameId, hookPublicId, callback
) {
  if (!gameId) {
    callback('No game id was provided. Operation: removeHook.', null)
    return
  }
  if (!hookPublicId) {
    callback('No hook public id was provided. Operation: removeHook.', null)
    return
  }

  this.sendJsonRequest(
    'removeHook',
    'DELETE',
    `/games/${gameId}/hooks/${hookPublicId}`,
    {},
    (error, res) => {
      callback(error, res)
    }
  )
}
