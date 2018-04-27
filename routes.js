/**
 * Created by luoming on 2018/4/25
 */

const {checkLogin, getStudentInfo, deleteInfo, saveInfo, checkSession,register} = require('./data');
const Router = require('koa-router');
//路由前缀
const router = new Router({
    prefix: '/koa'
});
// router.get('/', async ()=>{}); // responds to "/koa"
// router.get('/:id', async ()=>{}); // responds to "/koa/:id"

router.get('/getInformation', async (ctx, next) => {
    let username = ctx.session.user;
    let data = await getStudentInfo(`select * from student where teacher_email='${username}'`);
    ctx.body = {
        username,
        data
    }
})
router.get('/getInfomationById', async (ctx, next) => {
    let id = ctx.request.query.id;
    let data = await getStudentInfo(`select * from student where id=${id}`);
    ctx.body = data[0]
})
router.post('/deleteInfo', async (ctx, next) => {
    let id = ctx.request.body.id;
    let res = await deleteInfo(`delete from student where id=${id}`);
    ctx.body = true;
})
router.post('/saveInfo', async (ctx, next) => {
    let user = ctx.session.user;
    let {name, age, phone, id} = ctx.request.body;
    if (id) {
        let data = await saveInfo(`update student set name='${name}', age=${age}, phone='${phone}' where id=${id}`)
    } else {
        let data = await saveInfo(`insert into student (teacher_email,name,age,phone) values ('${user}','${name}',${age},'${phone}')`);
    }
    ctx.body = true;
})
router.post('/login', async (ctx, next) => {
    let email = ctx.request.body.email;
    let password = ctx.request.body.password;
    let data = await checkLogin(`select * from user where email = '${email}'`);
    let sessionData = await checkSession(`select * from _mysql_session_store where data='{"user":"${email}"}'`);
    if (data.length > 0) {
        ctx.session.user = email;
        ctx.body = {checked: true, message: ''};
    } else {
        ctx.body = {checked: false, message: '用户不存在'};
    }
})
router.post('/register',async (ctx,next)=>{
    let {email,password}=ctx.request.body;
    await register(`insert into user (email,password) values ('${email}','${password}')`);
    ctx.body=true;
})

router.get('/logout', async (ctx, next) => {
    ctx.session = null;
    ctx.body = true;
})

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


module.exports = router;