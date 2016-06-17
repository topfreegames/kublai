var Handler = function (app) {
  this.app = app
  this.kublaiService = this.app.get('kublai')
}

Handler.prototype.createClan = function(msg, session, next) {
  console.log(msg)
  next(null, { success: true })
}

Handler.prototype.testMethod = function (msg, session, next) {
  var route = 'testMethod'
  if (!msg) {
    catchError(new errors.InvalidMessage(msg), route, next)
  } else {
    next(null, { success: true })
  }
}

module.exports = function (app) {
  return new Handler(app)
}
