module.exports = async (ctx) => {
    ctx.body = ctx.session.user;
}