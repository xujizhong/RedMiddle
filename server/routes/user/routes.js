const Router = require('koa-router');
const user = require('../../app/controllers/user/user.js');

var router = new Router();

router.post('/updateProfile',user.updateProfile);
router.post('/updateAccount',user.updateAccount);

module.exports = router;