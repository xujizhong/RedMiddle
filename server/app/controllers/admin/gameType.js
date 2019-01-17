const gameType = require('../../models/gameType');
const mongoose = require('mongoose');

const gameTypeObj = {
    editGameType: async (ctx) => {
        const data = ctx.request.body;
        const res = await gameType.findByIdAndUpdate(
            data._id || mongoose.Types.ObjectId(),
            { $set: { name: data.name, sort: data.sort, 'meta.updateAt': Date.now() } },
            { upsert: true, new: true, setDefaultsOnInsert: true });
        ctx.body = { code: res.errors ? 500 : 200 }
    },
    deleteGameType: async (ctx) => {
        const data = ctx.request.body;

        const res = await gameType.deleteById(data._id);
        ctx.body = { code: res.errors ? 500 : 200 }

    },
    queryGameType: async (ctx) => {
        const res = await gameType.fetch();
        ctx.body = res
    },
}

module.exports = gameTypeObj;