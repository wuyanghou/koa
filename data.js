/**
 * Created by luoming on 2018/4/26
 */
let {query} = require('./util/db');

const checkLogin = async (sql) => {
    return await query(sql);
}
const register=async(sql)=>{
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

const checkSession=async (sql)=>{
    return await query(sql);
}

const alterPwd=async (sql)=>{
    return await query(sql);
}

const getFileList=async(sql)=>{
    return await query(sql);
}

const saveFile=async(sql)=>{
    return await query((sql));
}

module.exports={checkLogin,getStudentInfo,deleteInfo,saveInfo,checkSession,register,alterPwd,getFileList,saveFile};