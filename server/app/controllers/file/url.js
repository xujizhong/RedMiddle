const qiniu = require('qiniu');
const _config = require('../../../config/config');

const mac = new qiniu.auth.digest.Mac(_config.AK, _config.SK);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);
const privateBucketDomain = _config.qiniuUrl;

const url = key => {
    const deadline = parseInt(Date.now() / 1000) + (60 * 60 * 24); // 1天过期
    return bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline)
}
module.exports = url;