const nodemailer = require('nodemailer');// 引入 nodemailer
const config = require('../../config/config');  //全局配置
const Users = require('../models/users');    
const stringRandom = require('string-random');    
const crypto = require('crypto');               //node加密模块
const bcrypt  = require('bcryptjs');               //bcrypt加密密码

const sec = config.email_crypto_sec;

//加密邮箱验证码算法
function encrypt(str,secret){
	var cipher = crypto.createCipher('aes192',secret);
	var enc = cipher.update(str,'utf8','hex');
	enc += cipher.final('hex');
	return enc;
}

// 创建一个SMTP客户端配置
const stmp_config = {
        host: config.email_sender_host,
        port: config.email_sender_host_port,
        auth: {
            user: config.email_sender, //刚才注册的邮箱账号
            pass: config.email_sender_pass  //邮箱的授权码，不是注册时的密码
        }
    };

// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(stmp_config);

// 定义邮件
const mail = {
    // 发件人
    from: `xjzxjz <${config.email_sender}>`,
    // 主题
    subject: '激活邮箱账号',
    // 收件人
    to: '',
    // 邮件内容，HTML格式
    text: '' //接收激活请求的链接
};

// 储存用户信息并发送邮件
const send = async (ctx) => {
    //生成邮箱验证码
    const verificationCode = stringRandom(64);
    //密码加盐
    var salt = bcrypt.genSaltSync(10);              //盐强度
    var hash_password = bcrypt.hashSync(ctx.params.password, salt);  //加密

    //储存用户信息
    const user = new Users({
        name:ctx.params.name,
        password:hash_password,
        email:ctx.params.email,
        email_verification_code:verificationCode,
        email_verified:false
    });
    
    const res = await user.save(user).then(res=>res).catch(e=>e);
    //如果错误则return
    if(res.errmsg){
        let uniqueErr = "用户邮箱注册失败";

        if(res.code == 11000 && res.errmsg.indexOf('name_1') >= 0){
            uniqueErr = "用户名已经注册"
        }
        if(res.code == 11000 && res.errmsg.indexOf('email_1') >= 0){
            uniqueErr = "邮箱已经注册"
        }
        
        ctx.body = {code:res.code,msg:uniqueErr};
        return;
    }

    //发送邮件
    mail.to = ctx.params.email;
    const name_crypto = encrypt(ctx.params.name,sec);
    mail.text = `
    尊敬的${ctx.params.name}，您好！点击链接即可激活您的邮箱账号,
    ${config.cors_origin}/#/sign/signup/email/confirm/${name_crypto}/${verificationCode} 
    为保障您的帐号安全，请在24小时内点击该链接，您也可以将链接复制到浏览器地址栏访问。 
    若如果您并未尝试修改密码，请忽略本邮件，由此给您带来的不便请谅解。本邮件由系统自动发出，请勿直接回复！
    `
    
    const res_mail = await new Promise((resolve,reject)=>{
        transporter.sendMail(mail, function(error, info){
            if(error) {
                reject(error);
                return console.log(error);
            }
            resolve({code:200})
            console.log('mail sent:', info.response);
        });
    }).then(res=>res).catch(e=>e);

    //如果错误则return；如果正确则返回code：200
    if(res_mail.code !== 200){
        ctx.body = {code:500,msg:'邮件发送失败'};
        return;
    }else{
        ctx.body = {code:res_mail.code,msg:"注册成功，请去邮箱激活账户"}
    }


};

module.exports = send;