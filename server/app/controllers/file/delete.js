
const qiniu = require('qiniu');
const config = require('../../../config/config');

const deleteFile = (FullFileName) => {
    const accessKey = config.AK;
    const secretKey = config.SK;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var _config = new qiniu.conf.Config();
    _config.zone = qiniu.zone.Zone_z1;
    var bucketManager = new qiniu.rs.BucketManager(mac, _config);

    var bucket = config.scope;
    var key = FullFileName;
    return new Promise(resolve => {
        bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
            if (err) {
                console.log(err);
                //throw err;
                resolve({ code: 500 })
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
                if(respInfo.statusCode == 200 || respInfo.statusCode == 612 ){
                    resolve({ code: 200 })
                }else{
                    resolve({ code: 500 })
                }
            }
        });
    })

}

module.exports = deleteFile;