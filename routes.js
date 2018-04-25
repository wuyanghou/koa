/**
 * Created by luoming on 2018/4/25
 */

const Router =require('koa-router');
// const router=new Router();

//路由前缀
const router = new Router({
    prefix: '/koa'
});
// router.get('/', async ()=>{}); // responds to "/users"
// router.get('/:id', async ()=>{}); // responds to "/users/:id"


router.get('/',async(ctx,next)=>{
    ctx.body=`<div><h1>hello world</h1> <img src='./img.jpg' alt=""></div>`;
});
router.get('/about/:name',async(ctx,next)=>{
    // ctx.response.type = 'application/json';
    ctx.response.body={name:'luoming'};
});
router.get('/login',async (ctx,next)=>{
    ctx.body=ctx.query;
})
router.post('/login',async(ctx,next)=>{
    let postData=ctx.request.body;
    ctx.body=postData;
})

//原生代码支持jsonp  另外有 koa-jsonp中间件
router.get('/jsonp',async (ctx,next)=>{
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


module.exports=router;