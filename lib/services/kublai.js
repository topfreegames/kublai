module.exports = function(khanUrl, app, component) {
  return new KhanService(khanUrl, app, component);
};

var KhanService = function(khanUrl, app, component) {
  this.khanUrl = khanUrl
  this.app = app
  this._component = component
};
