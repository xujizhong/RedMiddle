const Router = require('koa-router');
const game = require('../../app/controllers/game/game.js');

var router = new Router();

router.get('/getSingleGameData/:englishName',game.getSingleGameData);
router.post('/getSingleGamePosts',game.getSingleGamePosts);
router.post('/sendNewPost',game.sendNewPost);
router.post('/getPostReply',game.getPostReply);
router.post('/sendNewReply',game.sendNewReply);

module.exports = router;