const Users = require('../models/users');
const bcrypt = require('bcryptjs');       //bcrypt加密密码

// 登录查询
const login = async (ctx) => {
    const { name, password } = ctx.request.body;

    //查询匹配用户名，密码，邮箱激活
    const user = await Users.findByData({ $or: [{ name: name }, { email: name }] }) || {};
    const passwordMatch = bcrypt.compareSync(password, user.password || '');

    if (!user || !passwordMatch) {
        ctx.body = { code: 500, msg: '用户名或密码错误' }
        return;
    }

    if (!user.email_verified) {
        ctx.body = { code: 500, msg: '用户邮箱未激活' }
        return;
    }

    ctx.session.user = user;

    ctx.body = { code: 200, user };

    // await next();
};

module.exports = login;