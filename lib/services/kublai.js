// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const http = require('http')
const https = require('https')
const request = require('request')
const url = require('url')
const errors = require('./../errors')

const gameOptionalParams = ['cooldownBeforeInvite', 'cooldownBeforeApply', 'maxPendingInvites']

const KhanService = function (khanUrl, timeout, maxSockets, app, component) {
  this.khanUrl = khanUrl
  this.timeout = timeout
  this.app = app
  this._component = component  // eslint-disable-line no-underscore-dangle
  const agentOptions = {
    keepAlive: true,
    maxSockets,
  }
  if (khanUrl.indexOf('https') !== -1) {
    this.keepAliveAgent = new https.Agent(agentOptions)
  } else {
    this.keepAliveAgent = new http.Agent(agentOptions)
  }
}

module.exports = function (khanUrl, timeout, maxSockets, app, component) {
  return new KhanService(khanUrl, timeout, maxSockets, app, component)
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
    timeout: this.timeout,
    agent: this.keepAliveAgent,
  }, (error, response, body) => {
    if (!error) {
      if (response.statusCode < 399) {
        if (body.metadata && typeof body.metadata === 'string') {
          body.metadata = JSON.parse(body.metadata)  // eslint-disable-line no-param-reassign
        }
        callback(null, body)
        return
      }
      const err = new errors.KhanError(
        `Could not process request: ${body.reason}. Operation: ${operation}.`
      )
      callback(err, null)
      return
    }
    const err = new errors.KhanError('Json request error', { original: error })
    callback(err, null)
  })
}

KhanService.prototype.healthcheck = function (callback) {
  this.sendJsonRequest('healthcheck', 'GET', '/healthcheck', callback)
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

  this.sendJsonRequest('createGame', 'POST', '/games', payload, callback)
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
    const err = new errors.KhanError('No game id was provided. Operation: updateGame.')
    callback(err, null)
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

  this.sendJsonRequest('updateGame', 'PUT', `/games/${publicId}`, payload, callback)
}

KhanService.prototype.createPlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: createPlayer.')
    callback(err, null)
    return
  }
  if (!publicId) {
    const err = new errors.KhanError('No player id was provided. Operation: createPlayer.')
    callback(err, null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }
  this.sendJsonRequest('createPlayer', 'POST', `/games/${gameId}/players`, payload, callback)
}

KhanService.prototype.updatePlayer = function (gameId, publicId, name, metadata, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: updatePlayer.')
    callback(err, null)
    return
  }
  if (!publicId) {
    const err = new errors.KhanError('No player id was provided. Operation: updatePlayer.')
    callback(err, null)
    return
  }

  const payload = {
    gameID: gameId,
    publicID: publicId,
    name,
    metadata,
  }

  this.sendJsonRequest('updatePlayer', 'PUT', `/games/${gameId}/players/${publicId}`, payload,
    callback)
}

KhanService.prototype.getPlayer = function (gameId, playerId, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: getPlayer.')
    callback(err, null)
    return
  }
  if (!playerId) {
    const err = new errors.KhanError('No player id was provided. Operation: getPlayer.')
    callback(err, null)
    return
  }
  this.sendJsonRequest('getPlayer', 'GET', `/games/${gameId}/players/${playerId}`, callback)
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
    const err = new errors.KhanError('No game id was provided. Operation: createClan.')
    callback(err, null)
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

  this.sendJsonRequest('createClan', 'POST', `/games/${gameId}/clans`, payload, callback)
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
    const err = new errors.KhanError('No game id was provided. Operation: updateClan.')
    callback(err, null)
    return
  }
  if (!publicId) {
    const err = new errors.KhanError('No clan id was provided. Operation: updateClan.')
    callback(err, null)
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

  this.sendJsonRequest('updateClan', 'PUT', `/games/${gameId}/clans/${publicId}`, payload, callback)
}

KhanService.prototype.getClan = function (gameId, clanId, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: getClan.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: getClan.')
    callback(err, null)
    return
  }

  this.sendJsonRequest('getClan', 'GET', `/games/${gameId}/clans/${clanId}`, callback)
}

KhanService.prototype.getClanSummary = function (gameId, clanId, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: getClanSummary.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: getClanSummary.')
    callback(err, null)
    return
  }

  this.sendJsonRequest('getClanSummary', 'GET', `/games/${gameId}/clans/${clanId}/summary`,
  callback)
}

KhanService.prototype.listClansSummary = function (gameId, clanIds, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: listClansSummary.')
    callback(err, null)
    return
  }
  if (!clanIds) {
    const err = new errors.KhanError('No clan ids were provided. Operation: listClansSummary.')
    callback(err, null)
    return
  }
  if (!(clanIds instanceof Array)) {
    const err = new errors.KhanError(
      'Bad clanIds provided, it must be an array. Operation: listClansSummary.'
    )
    callback(err, null)
    return
  }
  if (clanIds.length === 0) {
    const err = new errors.KhanError(
      'Empty clanIds provided, it must have length > 0. Operation: listClansSummary.'
    )
    callback(err, null)
    return
  }

  const qs = { clanPublicIds: clanIds.join(',') }
  this.sendJsonRequest('listClansSummary', 'GET', `/games/${gameId}/clans-summary`, undefined, qs,
    callback)
}

KhanService.prototype.listClans = function (gameId, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: listClans.')
    callback(err, null)
    return
  }

  this.sendJsonRequest('listClans', 'GET', `/games/${gameId}/clans`, callback)
}

KhanService.prototype.searchClans = function (gameId, term, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: searchClans.')
    callback(err, null)
    return
  }
  if (!term) {
    const err = new errors.KhanError('No search term was provided. Operation: searchClans.')
    callback(err, null)
    return
  }

  this.sendJsonRequest('searchClans', 'GET', `/games/${gameId}/clan-search?term=${term}`, callback)
}

KhanService.prototype.leaveClan = function (gameId, clanId, callback) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: leaveClan.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: leaveClan.')
    callback(err, null)
    return
  }

  this.sendJsonRequest('leaveClan', 'POST', `/games/${gameId}/clans/${clanId}/leave`, {}, callback)
}

KhanService.prototype.transferClanOwnership = function (
  gameId, clanId, playerPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: transferClanOwnership.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: transferClanOwnership.')
    callback(err, null)
    return
  }
  if (!playerPublicId) {
    const err = new errors.KhanError('No player id was provided. Operation: transferClanOwnership.')
    callback(err, null)
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
    callback
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
    const err = new errors.KhanError('No game id was provided. Operation: applyForMembership.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: applyForMembership.')
    callback(err, null)
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
    callback
  )
}

KhanService.prototype.approveDenyMembershipApplication = function (
  gameId, clanId, action, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError(
      'No game id was provided. Operation: approveDenyMembershipApplication.'
    )
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError(
      'No clan id was provided. Operation: approveDenyMembershipApplication.'
    )
    callback(err, null)
    return
  }
  if (!action) {
    const err = new errors.KhanError(
      'No action was provided. Operation: approveDenyMembershipApplication.'
    )
    callback(err, null)
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
    callback
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
    const err = new errors.KhanError('No game id was provided. Operation: inviteForMembership.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: inviteForMembership.')
    callback(err, null)
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
    callback
  )
}

KhanService.prototype.approveDenyMembershipInvitation = function (
  gameId, clanId, action, playerPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError(
      'No game id was provided. Operation: approveDenyMembershipInvitation.'
    )
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError(
      'No clan id was provided. Operation: approveDenyMembershipInvitation.'
    )
    callback(err, null)
    return
  }
  if (!action) {
    const err = new errors.KhanError(
      'No action was provided. Operation: approveDenyMembershipInvitation.'
    )
    callback(err, null)
    return
  }

  this.sendJsonRequest(
    'approveDenyMembershipInvitation',
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/invitation/${action}`,
    { playerPublicID: playerPublicId },
    callback
  )
}

KhanService.prototype.promoteDemoteMember = function (
  gameId, clanId, action, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: promoteDemoteMember.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: promoteDemoteMember.')
    callback(err, null)
    return
  }
  if (!action) {
    const err = new errors.KhanError('No action was provided. Operation: promoteDemoteMember.')
    callback(err, null)
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
    callback
  )
}

KhanService.prototype.deleteMembership = function (
  gameId, clanId, playerPublicId, requestorPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: deleteMembership.')
    callback(err, null)
    return
  }
  if (!clanId) {
    const err = new errors.KhanError('No clan id was provided. Operation: deleteMembership.')
    callback(err, null)
    return
  }

  const payload = {
    playerPublicID: playerPublicId,
    requestorPublicID: requestorPublicId,
  }

  this.sendJsonRequest(
    'deleteMembership',
    'POST',
    `/games/${gameId}/clans/${clanId}/memberships/delete`,
    payload,
    callback
  )
}

KhanService.prototype.createHook = function (
  gameId, hookType, hookURL, callback
) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: createHook.')
    callback(err, null)
    return
  }
  if (!hookType) {
    const err = new errors.KhanError('No hook type was provided. Operation: createHook.')
    callback(err, null)
    return
  }
  if (!hookURL) {
    const err = new errors.KhanError('No hook URL was provided. Operation: createHook.')
    callback(err, null)
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
    callback
  )
}

KhanService.prototype.removeHook = function (
  gameId, hookPublicId, callback
) {
  if (!gameId) {
    const err = new errors.KhanError('No game id was provided. Operation: removeHook.')
    callback(err, null)
    return
  }
  if (!hookPublicId) {
    const err = new errors.KhanError('No hook public id was provided. Operation: removeHook.')
    callback(err, null)
    return
  }

  this.sendJsonRequest(
    'removeHook',
    'DELETE',
    `/games/${gameId}/hooks/${hookPublicId}`,
    {},
    callback
  )
}
