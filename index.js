/**
 * Created by luoming on 2018/4/24
 */

const path=require('path');
const Koa = require('koa');
const Session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const BodyParser=require('koa-bodyparser');
const Static=require('koa-static');
const router =require('./routes');
const {query}=require('./util/db');
const {Log,CheckSession} =require('./middleware');
const app = new Koa();


//session 存储配置
const sessionMysqlConfig= require('./sql/config');

//配置session中间件
app.use(Session({
    key: 'USER_SID',
    cookie: {maxAge:1800000},
    store: new MysqlStore(sessionMysqlConfig)
}));

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static';

//bodyparser中间件
app.use(BodyParser());
//静态资源中间件
app.use(Static(path.join(__dirname,staticPath)));

app.use(async (ctx,next)=>{
    //生产环境使用了代理，不用设置   设置开发环境就好了
    // ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    ctx.set('Access-Control-Allow-Headers','Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    // ctx.set('Access-Control-Allow-Credentials',true);
    // ctx.set('X-Powered-By','3.2.1');
    if(ctx.request.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  await next();
})
app.use(CheckSession());
app.use(Log());
app.use(router.routes()).use(router.allowedMethods());

setInterval(async()=>{
   let currentTime =new Date().getTime();
   await query(`delete from _mysql_session_store where expires <'${currentTime}'`)
},600000)
app.listen(3000,()=>{
    console.log('listening at 3000');
});