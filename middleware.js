/**
 * Created by luoming on 2018/4/25
 */

let {checkSession} = require('./data');

/**
 * 自定义log中间件
 * @returns {Function}
 * @constructor
 */
const Log = () => {
  return async function (ctx, next) {
    console.log(ctx.method, new Date());
    await next()
  }
}

const CheckSession = () => {
  return async function (ctx, next) {
    if (ctx.request.path !== '/koa/login' && ctx.request.path !== '/koa/register') {
      let currentTime = new Date().getTime();
      let sessionId = ctx.cookies.get('USER_SID');
      let data = [];
      if (sessionId) {
        [data] = await Promise.all([
          checkSession(`select * from _mysql_session_store where id="USER_SID:${sessionId}"`),
          checkSession(`update _mysql_session_store set expires='${currentTime + 1800000}' where id="USER_SID:${sessionId}"`)
        ])
      }
      if (sessionId && data.length > 0) {
        await next();
      } else {
        ctx.status = 401;
      }
    } else {
      await next();
    }
  }
}

module.exports = {Log, CheckSession};