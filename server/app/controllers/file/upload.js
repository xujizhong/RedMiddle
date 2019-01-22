
const qiniu = require('qiniu');
const config = require('../../../config/config');
const Duplex = require('stream').Duplex;

const accessKey = config.AK;
const secretKey = config.SK;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
    scope: config.scope,
};

const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config_zf = new qiniu.conf.Config();
config_zf.zone = qiniu.zone.Zone_z1;
const formUploader = new qiniu.form_up.FormUploader(config_zf);
const putExtra = new qiniu.form_up.PutExtra();

const upload = (filePath, fileName, file) => {

    const base64Data = file.split(';')[1].split(',')[1];

    const readableStream = new Duplex();
    readableStream.push(Buffer.from(base64Data, 'base64'));
    readableStream.push(null) // 可读的流
    const key = filePath + '/' + fileName;

    return new Promise(resolve => {
        formUploader.putStream(uploadToken, key, readableStream, putExtra, function (respErr,
            respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                console.log(respBody);
                resolve({code:200})
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
                resolve({code:500})

            }
        });
    })

}

module.exports = upload;