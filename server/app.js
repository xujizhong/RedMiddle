const Koa = require('koa');                 //koa框架
const app = module.exports = new Koa();     //koa示例
const mongoose = require('mongoose');       //mongodb交互
const session = require('koa-session');     //session
const mongoStore = require('koa-session-mongoose');     //跟mongodb和session有关
const cors = require('@koa/cors');          //跨域
const config = require('./config/config');  //全局配置
const router = require('./routes/routes');  //路由
const adminRouter = require('./routes/admin/routes');  //管理模块路由
const gameRouter = require('./routes/game/routes');  //游戏模块路由
const userRouter = require('./routes/user/routes');  //用户模块路由
const urlRouter = require('./routes/file/routes');  //fileurl模块路由
const bodyParser = require('koa-bodyparser');  //req.body中间件

const maxAge = 24 * 60 * 60 * 7; //session cookie 过期时间（7day）


/**
 * error 处理
 */
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.type = 'html';
    ctx.body = '<p>Something <em>exploded</em>, please contact jizhong.</p>';


    ctx.app.emit('error', err, ctx);//触发error日志方法
  }
});

/**
 * error日志
 */
app.on('error', (err) => {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

/**
 * bodyParse
 */
app.use(bodyParser(
  {
    jsonLimit: '2mb', // 控制body的parse转换大小 default 1mb
    formLimit: '4096kb'  //  控制你post的大小  default 56kb
  }
));

/**
 * 跨域
 */
app.use(cors({ origin: config.cors_origin, credentials: true }));

(async () => {

  /**
   * 数据库连接 , 用户session
   */
  mongoose.set('useFindAndModify', false);  //DeprecationWarning: collection.findAndModify is deprecated....
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Mongodb connect error !'))
  db.once('open', () => { console.log('Mongodb started !') })
  const connection = await mongoose.connect(config.dbUrl, { useNewUrlParser: true });

  /**
   * session获取
   */
  const mongoStoreObj = new mongoStore({
    collection: 'sessions',
    connection: connection,
    expires: maxAge,        //10天
    name: 'Sessions'
  });

  app.keys = ['xjz_sec'];
  app.use(session({
    maxAge: maxAge * 1000,
    store: mongoStoreObj,
    rolling: true            //每次操作刷新session超时时间
  }, app));



  /**
   * 路由加载
   */
  app.use(router.routes());
  app.use(adminRouter.routes());
  app.use(gameRouter.routes());
  app.use(userRouter.routes());
  app.use(urlRouter.routes());


})()

/**
 * 开启server
 */
if (!module.parent) app.listen(config.server_port, () => {
  console.log('后端端口号 port %s', config.server_port)
});