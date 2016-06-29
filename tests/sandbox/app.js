// kublai
// https://github.com/topfreegames/kublai
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2016 Top Free Games <backend@tfgco.com>

const pomelo = require('pomelo')

const kublaiPlugin = require('../../index.js')

/**
 * Init app for client.
 */
const app = pomelo.createApp()
app.set('name', 'sandbox')

const redisHost = process.env.POMELO_REDIS_HOST || '127.0.0.1'
const redisPort = process.env.POMELO_REDIS_PORT || 3434

// configure monitor
app.configure('production|development', () => {
  app.set('monitorConfig',
    {
      monitor: pomelo.monitors.redismonitor,
      servers: '127.0.0.1:3334',
      redisNodes: {
        host: redisHost,
        port: redisPort,
      },
      redisOpts: {
        keyPrefix: 'kublai_test',
        showFriendlyErrorStack: true,
      },
    }
  )
})

// app configuration
app.configure('production|development', 'metagame', () => {
  app.set('connectorConfig',
    {
      connector: pomelo.connectors.hybridconnector,
      heartbeat: 3,
      useDict: true,
      useProtobuf: true,
    })

  app.use(kublaiPlugin, {
    kublai: {
      khanUrl: 'http://localhost:8888/',
    },
  })
})

// start app
app.start()

process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err.stack}`)
})
