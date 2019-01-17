const Router = require('koa-router');
const gameType = require('../../app/controllers/admin/gameType.js');
const gameCollection = require('../../app/controllers/admin/gameCollection.js');

var router = new Router();

router.post('/admin/editGameType',gameType.editGameType);
router.post('/admin/deleteGameType',gameType.deleteGameType);
router.post('/admin/queryGameType',gameType.queryGameType);

router.post('/admin/editGameCollection',gameCollection.editGameCollection);
router.post('/admin/deleteGameCollection',gameCollection.deleteGameCollection);
router.post('/admin/queryGameCollection',gameCollection.queryGameCollection);

module.exports = router;