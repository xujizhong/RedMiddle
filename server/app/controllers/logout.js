// 登出
const logout = async (ctx) => {
    delete ctx.session.user;
    ctx.body = {code:200};
};

module.exports = logout;