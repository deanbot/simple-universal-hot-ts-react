# It's a boilerplate! 👶

This is a good starting point for an isomorphic react app built in TS.

Features: 
  * Renders React server-side via Express
  * Provides API endpoints via Express
  * Uses TS for everything (including Webpack)
  * Compiles server down to js
  * Babel + Webpack used for compilation (not tsc)
  * Concurrent Webpack builds for server and client (_*sort of_)

😖 *Due to an issue with server-side HMR, only the prod build is concurrent. Hopefully the hacky solution is fixable.

  * Hot Module Replacement for server _and_ client 🤩
  * Webpack dev server for client development
  * Avoids:
    * Node.js API build scripts 
    * cluttered package.json scripts
    * maintaining multiple Webpack config files
    * having to use `import * as [...] from '[...]'` syntax due to differences in module format between Webpack and TS by compiling with Babel + Webpack instead of tsc 

# Get Started

**Install** deps

    yarn

**Build & Serve** the prod build

_(alias for `yarn build` -> `yarn serve`)_

    yarn start

**Deveolop** server and client with webpack dev server serving the client and with HMR in both server and client

    yarn dev

**Build** client and server 

_(server goes to `build` and client/assets go to `dist`)_

    yarn build

**Serve** the latest build
      
    yarn serve

# Environments

* dev (via `yarn dev`)
  * server 
    * launched at localhost:3000
    * built and patched in `build`
    * uses cors for accepting client api requests
    * to turn off server rendering pass `--env.useClientRenderOnly` in dev script
  * client
    * launched at localhost:8080
    * built virtuallly
    * dev server uses `/index.html` at root
    * proxies requests to /api to version with correct port (localhost:3000/api)
* production (via `yarn build` or `yarn start`)
  * server
    * built in `./build` 
  * client 
    * build in `./dist`

# The big idea

1. ts-node used automatically to parse `webpack.config.ts` during calls to webpack or webpack-dev-server.
1. all other code is built via webpack + babel-loader using @babel/typescript preset.
1. express server compiled down to `/build/server.js` and is launched via node
1. webpack config is a function accepting env params (for managing 'dev', 'prod', etc) passed via cli
1. webpack config returns an array of configs allowing parallel build
1. ~~single call to webpack-dev-server in `dev` script builds both configs in watch mode but only the first instance with devServer is used for the dev server~~

😖 Server-side HMR only working if I launch each webpack config separately. See `dev:server` and `dev:client`. Hopefully this hack is temporary.

1. during dev the start-server-webpack-plugin handles initial launch and relaunching of express server on changes after webpack build
1. webpack dev server serves client via entries in webpack config (i.e. `webpack-dev-server/client?http://localhost:8080`)
1. api requests are proxied to the correct server address (aka http://localhost:3000/api) during development
1. cors is implemented on the server during development to accept the requests from differing location
1. HMR implemented in server and client by settings in webpack config and by marking server (aka in `src/server/index.tsx`) and react app (aka in `src/app/App.tsx`) components as hot-exported (webpack.HotModuleReplacementPlugin & react-hot-loader)

# Application Requirements

### Build Requirements
* [yarn](https://yarnpkg.com/en/) 1.13.0+

### Runtime Requirements
* [Node.js](https://nodejs.org/en/) v11.10.0+