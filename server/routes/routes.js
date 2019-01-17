const Router = require('koa-router');
const getSessionData = require('../app/controllers/getSessionData');
const signup_email = require('../app/controllers/signup_email');
const signup_email_verificationCode = require('../app/controllers/signup_email_verificationCode');
const login = require('../app/controllers/login');
const logout = require('../app/controllers/logout');
const getCaptcha = require('../app/controllers/getCaptcha');

var router = new Router();

router.post('/getSessionData',getSessionData);
router.post('/signup/:name/:password/:email',signup_email);
router.post('/signup/email/confirm/:name_crypto/:verificationCode',signup_email_verificationCode);
router.post('/login',login);
router.post('/logout',logout);
router.get('/getCaptcha',getCaptcha);

module.exports = router;