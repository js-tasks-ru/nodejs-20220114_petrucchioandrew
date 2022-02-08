const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // log error
    console.log(err);
  }
});

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise(resolve => {
    subscribers.add(resolve);

    ctx.req.on('aborted', () => {
      subscribers.delete(resolve);
      resolve('Lost connection');
    });
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.body = 'No message';
    return;
  }
  for (let s of subscribers) {
    s(message);
  }
  subscribers.clear();
  ctx.body = 'Ok';
});

app.use(router.routes());

module.exports = app;
