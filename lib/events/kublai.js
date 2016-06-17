module.exports = function(app) {
  return new Event(app);
};

var Event = function(app) {
  this.app = app
};

//Event.prototype.add_servers = function(servers) {
  ////console.log('add', servers)
//};

//Event.prototype.remove_servers = function(ids) {
  ////console.log('remove', ids)
//};

//Event.prototype.replace_servers = function(servers) {
  ////console.log('replace', servers)
//};

//Event.prototype.bind_session = function(session) {
  ////console.log('bind', session)
//};

//Event.prototype.close_session = function(session) {
  ////console.log('close', session)
//};
