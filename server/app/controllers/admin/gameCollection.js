const gameCollection = require('../../models/gameCollection');
const upload = require('../file/upload');
const deleteFile = require('../file/delete');
const url = require('../file/url');
const mongoose = require('mongoose');
const _config = require('../../../config/config')

const gameCollectionObj = {
    editGameCollection: async (ctx) => {
        const data = ctx.request.body;
        const gameId = data._id || mongoose.Types.ObjectId();
        const filePath = 'gameCollection/' + gameId;

        const timestamp = Date.now();

        var imageType = '';
        var titleImageType = '';

        if (data.image.indexOf(_config.qiniuUrl) >= 0) {
            imageType = data.image.split('?')[0].split('.')
            imageType = imageType[imageType.length - 1]
        } else {
            imageType = data.image.split(';')[0].split('/')[1]
        }
        if (data.titleImage.indexOf(_config.qiniuUrl) >= 0) {
            titleImageType = data.titleImage.split('?')[0].split('.')
            titleImageType = titleImageType[titleImageType.length - 1]

        } else {
            titleImageType = data.titleImage.split(';')[0].split('/')[1]
        }

        var imageName = 'i' + timestamp + '.' + imageType;
        var titleImageName = 't' + timestamp + '.' + titleImageType;

        var p1 = Promise.resolve({ code: 200 })
        var p2 = Promise.resolve({ code: 200 })

        //先执行删除七牛云文件，防止先上传形成垃圾文件
        if (data._id) {

            const { image } = await gameCollection.findOne({ _id: data._id });
            if (data.image.indexOf(_config.qiniuUrl) < 0) {
                const d1 = await deleteFile(image);
                if (d1.code != 200) {
                    ctx.body = { code: 500, msg: "上传文件出错" };
                    return;
                }
                p1 = upload(filePath, imageName, data.image);
            } else {
                imageName = image.split('/')
                imageName = imageName[imageName.length - 1]

            }


            const { titleImage } = await gameCollection.findOne({ _id: data._id });
            if (data.titleImage.indexOf(_config.qiniuUrl) < 0) {
                const d2 = await deleteFile(titleImage);
                if (d2.code != 200) {
                    ctx.body = { code: 500, msg: "上传文件出错" };
                    return;
                }
                p2 = upload(filePath, titleImageName, data.titleImage);
            } else {
                titleImageName = titleImage.split('/')
                titleImageName = titleImageName[titleImageName.length - 1]
            }
        } else {
            p1 = upload(filePath, imageName, data.image);
            p2 = upload(filePath, titleImageName, data.titleImage);
        }



        const fileRes = await Promise.all([p1, p2]).then(res => res)
        if (fileRes[0].code != 200 || fileRes[1].code != 200) {
            console.log(fileRes);
            ctx.body = { code: 500, msg: "上传文件出错" };
            return;
        }
        const res = await gameCollection.findByIdAndUpdate(
            gameId,
            {
                $set: {
                    name: data.name,
                    englishName: data.englishName,
                    type: data.type,
                    image: filePath + "/" + imageName,
                    titleImage: filePath + "/" + titleImageName,
                    sort: data.sort,
                    'meta.updateAt': Date.now()
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true });
        ctx.body = { code: res.errors ? 500 : 200 }
    },
    deleteGameCollection: async (ctx) => {
        const data = ctx.request.body;
        const { image, titleImage } = await gameCollection.findOne({ _id: data._id });
        const d1 = deleteFile(image);
        const d2 = deleteFile(titleImage);
        const delete_res = await Promise.all([d1, d2]).then(res => res);
        if (delete_res[0].code != 200 || delete_res[1].code != 200) {
            ctx.body = { code: 500, msg: '文件删除失败' }
            return;
        }
        const res = await gameCollection.deleteById(data._id);
        ctx.body = { code: res.errors ? 500 : 200 }

    },
    queryGameCollection: async (ctx) => {
        const res = await gameCollection.fetch();
        res.forEach(n => {
            n.image = url(n.image)
            n.titleImage = url(n.titleImage)
        })
        ctx.body = res

    },
}

module.exports = gameCollectionObj;