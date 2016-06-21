const Handler = function (app) {
  this.app = app
}

module.exports = function (app) {
  return new Handler(app)
}

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = (msg, session, next) => {
  next(null, { code: 200, msg: 'Welcome to pomelo 2.0.' })
}

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = (msg, session, next) => {
  const result = {
    topic: 'publish',
    payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' }),
  }
  next(null, result)
}

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = (msg, session, next) => {
  const result = {
    topic: 'subscribe',
    payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' }),
  }
  next(null, result)
}
