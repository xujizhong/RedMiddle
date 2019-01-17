const svgCaptcha = require('svg-captcha');

module.exports = async (ctx) => {
    const captcha = svgCaptcha.create({
        width:245
    });
    captcha.text = captcha.text.toLowerCase();
    ctx.body = captcha;
}