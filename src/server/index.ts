import express from 'express';
import server from './server';

declare let module;

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

if (module.hot) {
  module.hot.accept('./server', function () {
    console.log('🔁  HMR Reloading `./app`...');
  });

  console.info('✅  Server-side HMR Enabled!');
} else {
  console.info('❌  Server-side HMR Not Supported.')
}

export default express()
  .use((req, res) => server.handle(req, res))
  .listen(PORT, HOST, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`🌏  listening on ${PORT}`)
  })