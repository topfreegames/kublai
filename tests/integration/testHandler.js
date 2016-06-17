require('./common')

describe('Integration', function () {
  describe('Test Handler', function () {
    it('Should execute test handler', function (done) {
      var reqRoute = 'metagame.sampleHandler.testMethod'
      var payload = {}
      this.pomeloClient.request(reqRoute, payload, function (res) {
        res.success.should.equal(true)
        done()
      })
    })
  })
})
