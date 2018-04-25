/**
 * Created by luoming on 2018/4/25
 */


/**
 * 自定义log中间件
 * @returns {Function}
 * @constructor
 */
const Log =()=>{
    return function(ctx,next){
        console.log(ctx.method,new Date());
        next()
    }
}

module.exports=Log;