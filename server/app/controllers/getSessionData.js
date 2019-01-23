
const url = require('./file/url');
const _config = require('../../config/config')

module.exports = async (ctx) => {
    if(ctx.session.user.avatar && ctx.session.user.avatar.indexOf(_config.qiniuUrl) < 0){
        ctx.session.user.avatar = url(ctx.session.user.avatar)
    }
    ctx.body = ctx.session.user;
}