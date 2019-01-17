const user = require('../../models/users');
const bcrypt = require('bcryptjs');       //bcrypt加密密码

const userObj = {
    async updateProfile(ctx) {
        const { name, avatar } = ctx.request.body;
        const userId = ctx.session.user._id.toString();

        const res = await user.findByIdAndUpdate(userId,
            { $set: { name, avatar, 'meta.updateAt': Date.now() } },
            { upsert: true, new: true, setDefaultsOnInsert: true }).then(res => res).catch(e => e);

        if (res.errmsg) {
            let uniqueErr = "保存失败";

            if (res.code == 11000 && res.errmsg.indexOf('name_1') >= 0) {
                uniqueErr = "用户名已存在"
            }

            ctx.body = { code: res.code, msg: uniqueErr };
            return;
        }

        if (!res.errors) {
            ctx.session.user.name = res.name;
            ctx.session.user.avatar = res.avatar;
        }
        ctx.body = { code: res.errors ? 500 : 200 }
    },
    async updateAccount(ctx) {
        const { new_password, old_password } = ctx.request.body;
        const password = ctx.session.user.password;
        const userId = ctx.session.user._id.toString();

        const passwordMatch = bcrypt.compareSync(old_password, password || '');
        if (!passwordMatch) {
            ctx.body = { code: 500, msg: '旧密码不正确' };
            return;
        } else {
            //密码加盐
            var salt = bcrypt.genSaltSync(10);              //盐强度
            var hash_password = bcrypt.hashSync(new_password, salt);  //加密

            const res = await user.findByIdAndUpdate(userId,
                { $set: { password: hash_password, 'meta.updateAt': Date.now() } },
                { upsert: true, new: true, setDefaultsOnInsert: true }).then(res => res).catch(e => e);
            if (res.errmsg) {
                let uniqueErr = "保存失败";
                ctx.body = { code: res.code, msg: uniqueErr };
                return;
            }
            if (!res.errors) {
                ctx.session.user.password = res.password;
            }
            ctx.body = { code: res.errors ? 500 : 200 }

        }
    }
}

module.exports = userObj;