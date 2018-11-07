/**
 * Created by luoming on 2018/4/25
 */
const {checkLogin, getStudentInfo, deleteInfo, saveInfo, checkSession, register, alterPwd, getFileList, saveFile} = require('./data');
const Router = require('koa-router');
const crypto = require("crypto");
const moment = require('moment');
//路由前缀
const router = new Router({
  prefix: '/koa'
});
// router.get('/', async ()=>{}); // responds to "/koa"
// router.get('/:id', async ()=>{}); // responds to "/koa/:id"
router.get('/getInformation', async (ctx, next) => {
  let username = ctx.session.user;
  let query = `select * from student where teacher_email='${username}'`;
  for (let key in ctx.query) {
    if (ctx.query[key]) {
      query += `and ${key} ='${ctx.query[key]}'`
    }
  }
  let data = await getStudentInfo(query);
  ctx.body = {
    username,
    data
  }
})
router.get('/getInfomationById', async (ctx, next) => {
  let id = ctx.request.query.id;
  let data = await getStudentInfo(`select * from student where id=${id}`);
  ctx.body = data[0]
});
router.post('/deleteInfo', async (ctx, next) => {
  let id = ctx.request.body.id;
  let res = await deleteInfo(`delete from student where id=${id}`);
  ctx.body = true;
});
router.post('/saveInfo', async (ctx, next) => {
  let user = ctx.session.user;
  let {name, age, phone, id} = ctx.request.body;
  if (id) {
    let data = await saveInfo(`update student set name='${name}', age=${age}, phone='${phone}' where id=${id}`)
  } else {
    let data = await saveInfo(`insert into student (teacher_email,name,age,phone) values ('${user}','${name}',${age},'${phone}')`);
  }
  ctx.body = true;
});
router.post('/login', async (ctx, next) => {
  let email = ctx.request.body.email;
  let password = ctx.request.body.password;
  let data = await checkLogin(`select * from user where email = '${email}' and password = ${password}`);
  let sessionData = await checkSession(`select * from _mysql_session_store where data='{"user":"${email}"}'`);
  if (data.length > 0) {
    ctx.session.user = email;
    ctx.body = {checked: true, message: ''};
  } else {
    ctx.body = {checked: false, message: '用户不存在'};
  }
});
router.post('/register', async (ctx, next) => {
  let {email, password} = ctx.request.body;
  let data = await checkLogin(`select * from user where email = '${email}'`) || [];
  if (data.length > 0) {
    ctx.body = {
      code: -1,
      message: '当前账号存在，请修改后提交！'
    }
  } else {
    await register(`insert into user (email,password) values ('${email}','${password}')`);
    ctx.body = {
      code: 0,
      message: '注册成功'
    }
  }
});
router.post('/alterPassword', async (ctx, next) => {
  let {oldPassword, newPassword} = ctx.request.body;
  let email = ctx.session.user;
  if (oldPassword === newPassword) {
    ctx.body = {
      code: -1,
      resultMessage: '新旧密码相同，请修改！'
    };
  } else {
    let data = await checkLogin(`select * from user where email = '${email}'`);
    if (data[0].password !== oldPassword) {
      ctx.body = {
        code: -1,
        resultMessage: '旧密码输入错误，请修改！'
      };
    } else {
      let data = await alterPwd(`update user set password=${newPassword} where email=${email}`);
      ctx.body = {
        code: 0,
        resultMessage: '修改成功'
      }
    }
  }
})
router.get('/logout', async (ctx, next) => {
  ctx.session = null;
  ctx.body = true;
});
router.get('/fileList', async (ctx, next) => {
  let username = ctx.session.user;
  let query = `select * from file where account='${username}'`;
  let data = await getFileList(query);
  ctx.body = {
    code: 0,
    data,
    resultMessage: '查询成功'
  }
});
router.post('/saveFile', async (ctx, next) => {
  let username = ctx.session.user;
  let {url} = ctx.request.body;
  url = JSON.stringify(url);
  let createTime=JSON.stringify(moment().format('YYYY-MM-DD HH:mm:ss'));
  let data = await saveFile(`insert into file (account,createTime,url) values (${username},${createTime},${url})`);
  ctx.body = {
    code: 0
  }
});

//原生代码支持jsonp  另外有 koa-jsonp中间件
router.get('/jsonp', async (ctx, next) => {
  let callbackName = ctx.query.callback || 'callback'
  let returnData = {
    success: true,
    data: {
      text: 'this is a jsonp api',
      name: 'luoming',
    }
  };
  let jsonpStr = `${callbackName}(${JSON.stringify(returnData)})`;
  ctx.type = 'text/javascript';
  ctx.body = jsonpStr
});

const config = {
  dirPath: 'luomings/', //oss 文件夹 不存在会自动创建
  bucket: 'wuyanghou', //oss应用名
  region: 'oss-cn-shanghai', //oss节点名
  accessKeyId: 'LTAIfGLZ6YwOFc6r', //申请的osskey
  accessKeySecret: '2gqiqx5QDOZ6xMp69uthPRy1eeB47D', //申请的osssecret
  callbackIp: "119.23.59.24", //回调ip,一定要能被外网访问的地址,你可以暂时用这个...后台的代码和下面路由一致,不过不建议
  callbackPort: "443", //回调端口
  callbackPath: "ossCallback", //回调接口
  expAfter: 60000, //签名失效时间
  maxSize: 1048576000 //最大文件大小
}
//获取oss签名
router.get('/getOssKey', async (ctx, next) => {
  const {
    bucket,
    region,
    expAfter,
    maxSize,
    dirPath,
    accessKeyId,
    accessKeySecret,
    callbackIp,
    callbackPort,
    callbackPath
  } = config;
  const host = `http://${bucket}.${region}.aliyuncs.com`; //你的oss完整地址
  const expireTime = new Date().getTime() + expAfter;
  const expiration = new Date(expireTime).toISOString();
  const policyString = JSON.stringify({
    expiration,
    conditions: [
      ['content-length-range', 0, maxSize],
    ]
  });
  const policy = Buffer(policyString).toString("base64");
  const Signature = crypto.createHmac('sha1', accessKeySecret).update(policy).digest("base64");
  const callbackBody = {
    "callbackUrl": `https://${callbackIp}:${callbackPort}/koa/${callbackPath}`,
    "callbackHost": `${callbackIp}`,
    "callbackBody": "{\"filename\": ${object},\"size\": ${size}}",
    "callbackBodyType": "application/json"
  };
  const callback = Buffer(JSON.stringify(callbackBody)).toString('base64');
  ctx.body = {
    code: 0,
    resultMessage: 'oss签名成功',
    result: {
      Signature,
      policy,
      host,
      'OSSAccessKeyId': accessKeyId,
      'key': expireTime,
      'success_action_status': 200,
      dirPath,
      callback
    }
  }
});
//oss 回调方法
router.post('/ossCallback', async (ctx, next) => {
  console.log('callback');
  ctx.body = {code: 200, status: 'success'};
})

module.exports = router;