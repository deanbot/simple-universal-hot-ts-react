# It's a boilerplate! 👶

This is a good starting point for an isomorphic react app built in TS.

Features: 
  * Renders React server-side via Express
  * Provides API endpoints via Express
  * Uses TS for everything (including Webpack)
  * Compiles server down to js
  * Babel + Webpack used for compilation (not tsc)
  * Builds uses concurrant webpack builds for server and client
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

# environments

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
* production (via `yarn build`)
  * server
    * built in `./build` 
  * client 
    * build in `./dist`

# The big idea

1. ts-node used automatically to parse `webpack.config.ts` during calls to webpack or webpack-dev-server.
2. all other code is built via webpack + babel-loader using @babel/typescript preset.
3. server compiled down to build/server.js and is launched via node
4. during dev the start-server-webpack-plugin handles initial launch and relaunching server on changes after webpack build.
5. webpack dev server serves client via entries in webpack config (i.e. `webpack-dev-server/client?http://localhost:8080`)
6. api requests are proxied to the correct server address (aka http://localhost:3000/api) during development.
7. cors is implemented on the server during development to accept the requests from differing location.
8. HMR implemented in server and client by properties in webpack config and by marking server (aka in `src/server/inedx.tsx`) and react app (aka in `src/app/App.tsx`) components as hot-exported (webpack.HotModuleReplacementPlugin && react-hot-loader).

# Application Requirements

### Build Requirements
* [yarn](https://yarnpkg.com/en/) 1.13.0+

### Runtime Requirements
* [Node.js](https://nodejs.org/en/) v11.10.0+