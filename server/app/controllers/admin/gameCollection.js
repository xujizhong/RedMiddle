const gameCollection = require('../../models/gameCollection');
const mongoose = require('mongoose');

const gameCollectionObj = {
    editGameCollection: async (ctx) => {
        const data = ctx.request.body;
        const res = await gameCollection.findByIdAndUpdate(
            data._id || mongoose.Types.ObjectId(),
            {
                $set: {
                    name: data.name,
                    englishName: data.englishName,
                    type: data.type,
                    image: data.image,
                    titleImage: data.titleImage,
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
        ctx.body = res

    },
}

module.exports = gameCollectionObj;