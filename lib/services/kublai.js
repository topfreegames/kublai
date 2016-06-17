// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

var url = require('url');
var request = require('request');
var errors = require('../errors')

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
        callback(null, body);
      } else {
        callback(new errors.InvalidRequestError(uri, "Could not process request: " + response.body), null);
      }
    } else {
      callback(error, null);
    }
  })
}

KhanService.prototype.createGame = function(opts, callback) {
  payload = {
    publicID: opts.publicID,
    name: opts.name,
    metadata: JSON.stringify(opts.metadata),
    minMembershipLevel: opts.minMembershipLevel,
    maxMembershipLevel: opts.maxMembershipLevel,
	  minLevelToAcceptApplication: opts.minLevelToAcceptApplication,
    minLevelToCreateInvitation: opts.minLevelToCreateInvitation,
    minLevelOffsetToPromoteMember: opts.minLevelOffsetToPromoteMember,
    minLevelToCreateInvitation: opts.minLevelToCreateInvitation,
    allowApplication: opts.allowApplication
  }

  this.sendJsonRequest('POST', '/games', payload, function(error, res) {
    callback(error, res)
  })
}
