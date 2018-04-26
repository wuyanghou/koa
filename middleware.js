/**
 * Created by luoming on 2018/4/25
 */


/**
 * 自定义log中间件
 * @returns {Function}
 * @constructor
 */
const Log =()=>{
    return async function(ctx,next){
        console.log(ctx.method,new Date());
        await next()
    }
}

const CheckLogin =()=>{
    return async function (ctx,next){
        if(ctx.request.path !=='/koa/login'){
            if(ctx.cookies.get('uuid') && ctx.cookies.get('uuid')==ctx.session.uuid ){
                await next();
            }else{
                ctx.status=401;
            }
        }else{
            await next();
        }
    }
}

module.exports={Log,CheckLogin};