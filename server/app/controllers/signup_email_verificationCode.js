const config = require('../../config/config');  //全局配置
const Users = require('../models/users');
const crypto = require('crypto');               //加密

const sec = config.email_crypto_sec;

//解密算法
function decrypt(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// 验证邮箱
const verificationCode = async (ctx) => {
    const name = decrypt(ctx.params.name_crypto, sec);
    const verificationCode = ctx.params.verificationCode;

    const user = await Users.findByName(name);
    const email_verification_code = user.email_verification_code;

    if (email_verification_code === verificationCode) {
        const res = await Users.updateEmailVerifiedByName(name);
        if (res.ok) {
            ctx.session.user = user;
            ctx.body = { code: 200, msg: '邮箱已经激活', user }
        } else {
            ctx.body = { code: 500, msg: '邮箱激活失败' }
        }
    } else {
        ctx.body = { code: 500, msg: '链接错误或者已经失效' }
    }
};

module.exports = verificationCode;