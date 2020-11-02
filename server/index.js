const Koa        = require('koa');
const next       = require('next');
const Router     = require('koa-router');
const cors       = require('@koa/cors');
const bodyParser = require('koa-body');
const { join }   = require('path');
const mongoose   = require('mongoose');
const dotenv     = require('dotenv');

dotenv.config();
const port      = parseInt(process.env.PORT, 10) || 4000;
const dev       = process.env.NODE_ENV !== 'production';
const app       = next({ dev });
const handle    = app.getRequestHandler();
const apiRouter = new Router({ prefix: '/api' });

mongoose.connect(process.env.MONGODB_CONNECTION, {
  useCreateIndex:     true,
  useNewUrlParser:    true,
  useUnifiedTopology: true,
  useFindAndModify:   false,
});

app.prepare()
  .then(() => {
    const server = new Koa();
    const router = new Router();

    server.use(cors());
    server.use(bodyParser({
      multipart: true,
    }));

    router.get('/healthcheck', async ctx => {
      ctx.body    = 'ok';
      ctx.respond = true;
    });

    require('./controllers')(apiRouter);
    router.use(apiRouter.routes());
    server.use(router.routes());
    server.use(router.allowedMethods());

    router.get('*', async ctx => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    const handleError = (err, ctx) => {
      console.log('err: ', err);
      if (ctx == null) {
        console.error('Error: ', 'Unhandled exception occured - ' + JSON.stringify(err));
      }
    };

    server.on('error', handleError);

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });

