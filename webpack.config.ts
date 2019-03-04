import * as path from 'path';
import { getIfUtils, removeEmpty } from 'webpack-config-utils';
import * as nodeExternals from 'webpack-node-externals';
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const StartServerPlugin = require('start-server-webpack-plugin');

export default env => {
  const {
    ifProd,
    ifNotProd,
  } = getIfUtils(env)

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000
  const CLIENT_PORT = 8080

  // pass --env.useClientRenderOnly=true to webpack to deactivate server rendering
  const useClientRenderOnly = env.useClientRenderOnly == 'true'

  const shared = {
    resolve: {
      modules: [path.resolve(__dirname, 'shared'), 'node_modules'],
      extensions: ['*', '.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
      ]
    },
    mode: ifProd('production', 'development')
  }

  // plugins shared between server and client
  const sharedPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        ifProd('production', 'development')
      )
    }),

    ...ifProd(
      // prod plugins
      [

      ],

      // dev plugins
      [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ]
    )
  ]

  const client = {
    ...shared,
    devtool: ifProd('source-map', 'cheap-module-eval-source-map'),
    ...ifProd({}, {
      devServer: {
        historyApiFallback: true,
        hot: true,
        noInfo: true,
        // inline: true,
        proxy: {
          '/api': `http://${HOST}:${PORT}`
        },
      },
    }),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    entry: removeEmpty([
      path.join(__dirname, 'src', 'webpack-public-path'),
      ...ifNotProd([
        `webpack-dev-server/client?http://${HOST}:${CLIENT_PORT}/`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
      ], []),
      path.join(__dirname, 'src', 'client', 'index'),
    ]),
    target: 'web',
    plugins: removeEmpty([
      ...sharedPlugins,

      ...ifProd(
        [],
        [
          new webpack.NoEmitOnErrorsPlugin(),
        ]
      ),

      new WebpackBar({
        color: 'green',
        name: 'Client',
      }),
    ])
  }

  const server = {
    ...shared,
    entry: {
      server: removeEmpty([
        ifNotProd('webpack/hot/poll?1000'),
        path.join(__dirname, 'src', 'server', 'index'),
      ])
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'server.js',
    },
    devtool: 'source-map',
    plugins: removeEmpty([
      ...sharedPlugins,

      ...ifProd(
        // prod plugins
        [
          new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
          })
        ],

        // dev plugins
        [
          new StartServerPlugin(),
        ]
      ),

      new webpack.DefinePlugin({
        __USE_CLIENT_RENDER_ONLY__: useClientRenderOnly,
      }),

      new WebpackBar({
        color: 'orange',
        name: 'Server',
      }),
    ]),
    externals: [nodeExternals({
      whitelist: ['webpack/hot/poll?1000']
    })],
    target: 'node',
    node: {
      __dirname: true,
      fs: 'empty'
    }
  }

  // pass --env.target=server|client to return a single config
  if (env.target == 'server') {
    return server;
  } else if (env.target == 'client') {
    return client;
  }

  return [
    // client config must be first for wds
    {
      ...client
    },
    {
      ...server
    },
  ]
}