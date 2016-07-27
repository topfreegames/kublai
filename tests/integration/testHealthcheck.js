// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

require('./common')

describe('Integration', () => {
  describe('Healthcheck Test Handler', () => {
    it('Should work', function (done) {
      const self = this
      const reqRoute = 'metagame.sampleHandler.healthcheck'
      self.pomeloClient.request(reqRoute, {}, (healthcheckRes) => {
        healthcheckRes.should.equal('WORKING')
        done()
      })
    })
  })
})
