/**
 * Created by luoming on 2018/4/26
 */
let {query} = require('./util/db');

const checkLogin = async (sql) => {
    return await query(sql);
}

const getStudentInfo=async (sql)=>{
    return await query(sql);
}
const deleteInfo=async (sql)=>{
    return await query(sql);
}

const saveInfo=async (sql)=>{
    return await query(sql);
}

module.exports={checkLogin,getStudentInfo,deleteInfo,saveInfo};