Using Kublai
============

## Installing Kublai

You can install Kublai using npm:

```
npm install Kublai-plugin
```

## Integrating Kublai plugin with your Pomelo application

Our [sandbox application](https://github.com/topfreegames/kublai/tree/master/tests/sandbox) is a reference example of how to integrate Kublai into your pomelo application.

### Initializing Kublai in your app

In your `app.js` file, add the following lines:

```js
const kublaiPlugin = require('kublai-plugin')

// app configuration
app.configure('production|development', '<server-type>', () => {

  // your app configuration

  app.use(kublaiPlugin, {
    kublai: {
      khanUrl: 'http://localhost:8888/',  // you need to set this to your khan API url
      timeout: 500,                       // request timeout in milliseconds (default value is 500ms)
    },
  })
})
```

## Using Kublai in your handlers

Using it in your handlers is as easy as asking the app for it:

    // in your handler initialization
    const Handler = function (app) {
      this.app = app
      this.kublaiService = this.app.get('kublai')  // this gets a configured kublai service instance
    }

Then in your handler methods:

    Handler.prototype.getPlayer = function (msg, session, next) {
      this.kublaiService.getPlayer(msg.gameID, msg.publicID, (error, res) => {
        if (error) {
          next(error, null)
        } else {
          next(null, res)
        }
      }
    }

For a complete example, our test sandbox has a [handler](https://github.com/topfreegames/kublai/tree/master/tests/sandbox/app/servers/metagame/handler/sampleHandler.js) with all available methods.
