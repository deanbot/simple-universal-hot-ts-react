import cors from 'cors';
import express from 'express';
import { hot } from 'react-hot-loader/root';

const server = express()

if (process.env.NODE_ENV == 'development') {
  server
    .use(cors())
}

server
  .use(express.static('dist'))
  .use('/api', require('./middleware/api').default)
  .use(require('./middleware/view').default)

export default hot(server)