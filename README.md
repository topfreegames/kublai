# kublai
[![Build Status](https://travis-ci.org/topfreegames/khan.svg?branch=master)](https://travis-ci.org/topfreegames/khan)
[![npm version](https://badge.fury.io/js/kublai-plugin.svg)](https://badge.fury.io/js/kublai-plugin)

Pomelo plug-in for [khan clan server](https://github.com/topfreegames/khan).

## Download kublai

You can download kublai using npm:

```
npm install kublai-plugin
```

## Integrating kublai plugin with your Pomelo application

The [tests/sandbox folder](tests/sandbox) has real examples of how to do the integration, make sure you check it out.

### Register the kublai plugai in your app configuration

In your `app.js` add the following lines:

```js
const kublaiPlugin = require('kublai-pugin')

// app configuration
app.configure('production|development', 'metagame', () => {

  // your app configuration

  app.use(kublaiPlugin, {
    kublai: {
      khanUrl: 'http://localhost:8888/',  // you need to set this to your khan API url
    },
  })
})
```

Then, in your game handlers create a handler like [this sample handler](tests/sandbox/app/servers/metagame/handler/sampleHandler.js).

## Developing kublai

If you are trying to develop kublai you can use the following commands:

### Setup

Run `make setup`.

### Tests

Running tests can be done with `make test`.
