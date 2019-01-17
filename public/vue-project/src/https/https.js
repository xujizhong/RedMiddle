const axios = require('axios');
const store = require('../store.js');
const http = store.default.state.api;

axios.defaults.withCredentials = true;    //跨域请求携带cookie

module.exports = {
    test() {
        return axios.post(http + '/admin/5b9f525f7314574543480097')
            .then(res => res.data.success).catch(e => e)
    },
    //获取session数据
    getSessionData(){
        return axios.post(http + `/getSessionData`)
            .then(res => res).catch(e => e)
    },
    //邮箱注册
    signup_email(name,password,email){
        return axios.post(http + `/signup/${name}/${password}/${email}`)
            .then(res => res).catch(e => e)
    },
    //邮箱验证
    signup_email_verificationCode(name_crypto,verificationCode){
        return axios.post(http + `/signup/email/confirm/${name_crypto}/${verificationCode}`)
            .then(res => res).catch(e => e)
    },
    //登录
    login(data){
        return axios.post(http + `/login`,data)
            .then(res => res).catch(e => e)
    },
    //登出
    logout(){
        return axios.post(http + `/logout`)
            .then(res => res).catch(e => e)
    },
    //获取验证码
    getCaptcha(){
        return axios.get(http + `/getCaptcha`)
            .then(res => res).catch(e => e)
    }
}