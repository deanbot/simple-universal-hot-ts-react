# It's a boilerplate! 👶

This one is good for you if you like:
  * Rendering React server-side via Express
  * Using TS for everything but still compiling your server down to js
  * Building quickly and sexily with concurrant webpack builds for server and client
  * Hot Module Replacement for server _and_ client 🤩
  * Avoiding
    * Node.js API build scripts 
    * cluttered package.json scripts
    * maintaining multiple webpack config files
    * semicolons

## Go forth adventurer 🧙

# Get Started
_By Topic_

**Install** deps

    yarn

**Build & Serve** the prod build

_(alias for `yarn build` -> `yarn serve`)_

    yarn start

**Build** client and server 

_(server goes to `build` and client/assets go to `dist`)_

    yarn build

**Serve** the latest build
      
    yarn serve

**Deveolop** with HMR server & client

    yarn dev

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

# Application Requirements

### Build Requirements
* [yarn](https://yarnpkg.com/en/) 1.13.0+

### Runtime Requirements
* [Node.js](https://nodejs.org/en/) v11.10.0+