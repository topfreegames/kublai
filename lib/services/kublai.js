// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const Promise = require('bluebird')
const http = require('http')
const https = require('https')
const axios = require('axios')
const errors = require('./../errors')

const gameOptionalParams = ['cooldownBeforeInvite', 'cooldownBeforeApply', 'maxPendingInvites']

function isFunction(functionToCheck) {
  const getType = {}
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

class KhanService {
  constructor(khanUrl, timeout, maxSockets, app, component) {
    this.khanUrl = khanUrl
    this.timeout = timeout
    this.app = app
    this._component = component  // eslint-disable-line no-underscore-dangle
    const agentOptions = {
      keepAlive: true,
      maxSockets,
    }
    this.httpsKeepAliveAgent = new https.Agent(agentOptions)
    this.httpKeepAliveAgent = new http.Agent(agentOptions)
    this.client = axios.create({
      baseURL: this.khanUrl,
      responseType: 'json',
      timeout: this.timeout,
      httpAgent: this.httpKeepAliveAgent,
      httpsAgent: this.httpsKeepAliveAgent,
      validateStatus: (status) => status < 400,
    })
  }

  sendJsonRequest(operation, method, url, data, params, cb) {
    if (isFunction(data)) {
      cb = data  // eslint-disable-line no-param-reassign
      data = null // eslint-disable-line no-param-reassign
    } else if (isFunction(params)) {
      cb = params  // eslint-disable-line no-param-reassign
      params = null  // eslint-disable-line no-param-reassign
    }

    const request = this.client.request({ method, url, params, data })
    .then(response => {
      const body = response.data
      if (body.metadata && typeof body.metadata === 'string') {
        body.metadata = JSON.parse(body.metadata)  // eslint-disable-line no-param-reassign
      }
      return body
    })
    .catch(error => {
      let err = new errors.KhanError('Json request error', { original: error })
      if (error.response) {
        const body = error.response.data
        err = new errors.KhanError(
          `Could not process request: ${body.reason}. Operation: ${operation}.`, { original: error }
        )
      }
      throw err
    })

    if (cb) {
      return Promise.resolve(request).asCallback(cb)
    }
    return request
  }

  handleError(cb, err) {
    if (cb) {
      cb(err, null)
    }
    throw err
  }

  healthcheck(cb) {
    return this.sendJsonRequest('healthcheck', 'GET', '/healthcheck', cb)
  }

  createGame(
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
    cb
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
      cb = options  // eslint-disable-line no-param-reassign
      options = {}        // eslint-disable-line no-param-reassign
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(param => {
        if (gameOptionalParams.indexOf(param) > -1) {
          payload[param] = options[param]
        }
      })
    }

    return this.sendJsonRequest('createGame', 'POST', '/games', payload, cb)
  }

  updateGame(
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
    cb) {
    if (options instanceof Function) {
      cb = options  // eslint-disable-line no-param-reassign
      options = {}        // eslint-disable-line no-param-reassign
    }

    if (!publicId) {
      const err = new errors.KhanError('No game id was provided. Operation: updateGame.')
      return this.handleError(cb, err)
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

    return this.sendJsonRequest('updateGame', 'PUT', `/games/${publicId}`, payload, cb)
  }

  createPlayer(gameId, publicId, name, metadata, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: createPlayer.')
      return this.handleError(cb, err)
    }
    if (!publicId) {
      const err = new errors.KhanError('No player id was provided. Operation: createPlayer.')
      return this.handleError(cb, err)
    }

    const payload = {
      gameID: gameId,
      publicID: publicId,
      name,
      metadata,
    }
    return this.sendJsonRequest('createPlayer', 'POST', `/games/${gameId}/players`, payload, cb)
  }

  updatePlayer(gameId, publicId, name, metadata, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: updatePlayer.')
      return this.handleError(cb, err)
    }
    if (!publicId) {
      const err = new errors.KhanError('No player id was provided. Operation: updatePlayer.')
      return this.handleError(cb, err)
    }

    const payload = {
      gameID: gameId,
      publicID: publicId,
      name,
      metadata,
    }

    return this.sendJsonRequest(
      'updatePlayer', 'PUT', `/games/${gameId}/players/${publicId}`, payload, cb
    )
  }

  getPlayer(gameId, playerId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: getPlayer.')
      return this.handleError(cb, err)
    }
    if (!playerId) {
      const err = new errors.KhanError('No player id was provided. Operation: getPlayer.')
      return this.handleError(cb, err)
    }
    return this.sendJsonRequest('getPlayer', 'GET', `/games/${gameId}/players/${playerId}`, cb)
  }

  createClan(gameId, publicId, name, metadata, ownerPublicId, allowApplication, autoJoin, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: createClan.')
      return this.handleError(cb, err)
    }

    const payload = {
      publicID: publicId,
      name,
      metadata,
      ownerPublicID: ownerPublicId,
      allowApplication,
      autoJoin,
    }

    return this.sendJsonRequest('createClan', 'POST', `/games/${gameId}/clans`, payload, cb)
  }

  updateClan(gameId, publicId, name, metadata, ownerPublicId, allowApplication, autoJoin, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: updateClan.')
      return this.handleError(cb, err)
    }
    if (!publicId) {
      const err = new errors.KhanError('No clan id was provided. Operation: updateClan.')
      return this.handleError(cb, err)
    }

    const payload = {
      publicID: publicId,
      name,
      metadata,
      ownerPublicID: ownerPublicId,
      allowApplication,
      autoJoin,
    }

    return this.sendJsonRequest(
      'updateClan', 'PUT', `/games/${gameId}/clans/${publicId}`, payload, cb
    )
  }

  getClan(gameId, clanId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: getClan.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: getClan.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest('getClan', 'GET', `/games/${gameId}/clans/${clanId}`, cb)
  }

  getClanSummary(gameId, clanId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: getClanSummary.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: getClanSummary.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest(
      'getClanSummary', 'GET', `/games/${gameId}/clans/${clanId}/summary`, cb
    )
  }

  listClansSummary(gameId, clanIds, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: listClansSummary.')
      return this.handleError(cb, err)
    }
    if (!clanIds) {
      const err = new errors.KhanError('No clan ids were provided. Operation: listClansSummary.')
      return this.handleError(cb, err)
    }
    if (!(clanIds instanceof Array)) {
      const err = new errors.KhanError(
        'Bad clanIds provided, it must be an array. Operation: listClansSummary.'
      )
      return this.handleError(cb, err)
    }
    if (clanIds.length === 0) {
      const err = new errors.KhanError(
        'Empty clanIds provided, it must have length > 0. Operation: listClansSummary.'
      )
      return this.handleError(cb, err)
    }

    const qs = { clanPublicIds: clanIds.join(',') }
    return this.sendJsonRequest(
      'listClansSummary', 'GET', `/games/${gameId}/clans-summary`, undefined, qs, cb
    )
  }

  listClans(gameId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: listClans.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest('listClans', 'GET', `/games/${gameId}/clans`, cb)
  }

  searchClans(gameId, term, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: searchClans.')
      return this.handleError(cb, err)
    }
    if (!term) {
      const err = new errors.KhanError('No search term was provided. Operation: searchClans.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest(
      'searchClans', 'GET', `/games/${gameId}/clan-search?term=${term}`, cb
    )
  }

  leaveClan(gameId, clanId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: leaveClan.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: leaveClan.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest(
      'leaveClan', 'POST', `/games/${gameId}/clans/${clanId}/leave`, {}, cb
    )
  }

  transferClanOwnership(gameId, clanId, playerPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: transferClanOwnership.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: transferClanOwnership.')
      return this.handleError(cb, err)
    }
    if (!playerPublicId) {
      const err = new errors.KhanError(
        'No player id was provided. Operation: transferClanOwnership.'
      )
      return this.handleError(cb, err)
    }

    const payload = {
      playerPublicID: playerPublicId,
    }

    return this.sendJsonRequest(
      'transferClanOwnership',
      'POST',
      `/games/${gameId}/clans/${clanId}/transfer-ownership`,
      payload,
      cb
    )
  }

  applyForMembership(gameId, clanId, level, playerPublicId, message, cb) {
    if (message instanceof Function) {
      cb = message  // eslint-disable-line no-param-reassign
      message = undefined  // eslint-disable-line no-param-reassign
    }
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: applyForMembership.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: applyForMembership.')
      return this.handleError(cb, err)
    }

    const payload = {
      level,
      playerPublicID: playerPublicId,
    }

    if (!!message) {
      payload.message = message
    }

    return this.sendJsonRequest(
      'applyForMembership',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/application`,
      payload,
      cb
    )
  }

  approveDenyMembershipApplication(gameId, clanId, action, playerPublicId, requestorPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError(
        'No game id was provided. Operation: approveDenyMembershipApplication.'
      )
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError(
        'No clan id was provided. Operation: approveDenyMembershipApplication.'
      )
      return this.handleError(cb, err)
    }
    if (!action) {
      const err = new errors.KhanError(
        'No action was provided. Operation: approveDenyMembershipApplication.'
      )
      return this.handleError(cb, err)
    }

    const payload = {
      playerPublicID: playerPublicId,
      requestorPublicID: requestorPublicId,
    }

    return this.sendJsonRequest(
      'approveDenyMembershipApplication',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/application/${action}`,
      payload,
      cb
    )
  }

  inviteForMembership(gameId, clanId, level, playerPublicId, requestorPublicId, message, cb) {
    if (message instanceof Function) {
      cb = message  // eslint-disable-line no-param-reassign
      message = undefined  // eslint-disable-line no-param-reassign
    }
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: inviteForMembership.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: inviteForMembership.')
      return this.handleError(cb, err)
    }

    const payload = {
      level,
      playerPublicID: playerPublicId,
      requestorPublicID: requestorPublicId,
    }

    if (!!message) {
      payload.message = message
    }

    return this.sendJsonRequest(
      'inviteForMembership',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/invitation`,
      payload,
      cb
    )
  }

  approveDenyMembershipInvitation(gameId, clanId, action, playerPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError(
        'No game id was provided. Operation: approveDenyMembershipInvitation.'
      )
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError(
        'No clan id was provided. Operation: approveDenyMembershipInvitation.'
      )
      return this.handleError(cb, err)
    }
    if (!action) {
      const err = new errors.KhanError(
        'No action was provided. Operation: approveDenyMembershipInvitation.'
      )
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest(
      'approveDenyMembershipInvitation',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/invitation/${action}`,
      { playerPublicID: playerPublicId },
      cb
    )
  }

  promoteDemoteMember(gameId, clanId, action, playerPublicId, requestorPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: promoteDemoteMember.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: promoteDemoteMember.')
      return this.handleError(cb, err)
    }
    if (!action) {
      const err = new errors.KhanError('No action was provided. Operation: promoteDemoteMember.')
      return this.handleError(cb, err)
    }

    const payload = {
      playerPublicID: playerPublicId,
      requestorPublicID: requestorPublicId,
    }

    return this.sendJsonRequest(
      'promoteDemoteMember',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/${action}`,
      payload,
      cb
    )
  }

  deleteMembership(gameId, clanId, playerPublicId, requestorPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: deleteMembership.')
      return this.handleError(cb, err)
    }
    if (!clanId) {
      const err = new errors.KhanError('No clan id was provided. Operation: deleteMembership.')
      return this.handleError(cb, err)
    }

    const payload = {
      playerPublicID: playerPublicId,
      requestorPublicID: requestorPublicId,
    }

    return this.sendJsonRequest(
      'deleteMembership',
      'POST',
      `/games/${gameId}/clans/${clanId}/memberships/delete`,
      payload,
      cb
    )
  }

  createHook(gameId, hookType, hookURL, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: createHook.')
      return this.handleError(cb, err)
    }
    if (!hookType) {
      const err = new errors.KhanError('No hook type was provided. Operation: createHook.')
      return this.handleError(cb, err)
    }
    if (!hookURL) {
      const err = new errors.KhanError('No hook URL was provided. Operation: createHook.')
      return this.handleError(cb, err)
    }

    const payload = {
      type: hookType,
      hookURL,
    }

    return this.sendJsonRequest('createHook', 'POST', `/games/${gameId}/hooks`, payload, cb)
  }

  removeHook(gameId, hookPublicId, cb) {
    if (!gameId) {
      const err = new errors.KhanError('No game id was provided. Operation: removeHook.')
      return this.handleError(cb, err)
    }
    if (!hookPublicId) {
      const err = new errors.KhanError('No hook public id was provided. Operation: removeHook.')
      return this.handleError(cb, err)
    }

    return this.sendJsonRequest(
      'removeHook', 'DELETE', `/games/${gameId}/hooks/${hookPublicId}`, {}, cb
    )
  }
}

module.exports = function (khanUrl, timeout, maxSockets, app, component) {
  return new KhanService(khanUrl, timeout, maxSockets, app, component)
}
