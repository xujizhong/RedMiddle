const Router = require('koa-router');
const url = require('../../app/controllers/file/url.js');

var router = new Router();

router.post('/getFileUrl',url);

module.exports = router;