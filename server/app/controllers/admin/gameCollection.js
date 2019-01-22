const gameCollection = require('../../models/gameCollection');
const upload = require('../file/upload');
const url = require('../file/url');
const mongoose = require('mongoose');

const gameCollectionObj = {
    editGameCollection: async (ctx) => {
        const data = ctx.request.body;
        const gameId = data._id || mongoose.Types.ObjectId();
        const filePath = 'gameCollection/' + gameId;

        const timestamp = Date.now();

        const imageType = data.image.split(';')[0].split('/')[1];
        const titleImageType = data.titleImage.split(';')[0].split('/')[1];

        const imageName = 'i' + timestamp + '.' + imageType;
        const titleImageName = 't' + timestamp + '.' + titleImageType;

        const p1 = upload(filePath, imageName, data.image);
        const p2 = upload(filePath, titleImageName, data.titleImage);

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

        const res = await gameCollection.deleteById(data._id);
        ctx.body = { code: res.errors ? 500 : 200 }

    },
    queryGameCollection: async (ctx) => {
        const res = await gameCollection.fetch();
        res.forEach(n=>{
            n.image = url(n.image)
            n.titleImage = url(n.titleImage)
        })
        ctx.body = res

    },
}

module.exports = gameCollectionObj;