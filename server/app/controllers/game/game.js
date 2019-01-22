const gameCollection = require('../../models/gameCollection');
const gamePost = require('../../models/gamePost');
const gameReply = require('../../models/gameReply');
const mongoose = require('mongoose');
const url = require('../file/url');

const gameObj = {
    getSingleGameData: async (ctx) => {
        const englishName = ctx.params.englishName;
        const res = await gameCollection.findOne({ englishName });
        res.titleImage = url(res.titleImage)
        ctx.body = res
    },
    getSingleGamePosts: async (ctx) => {
        const { gameId, skip, limit } = ctx.request.body;
        const count = await gamePost.countDocuments({ gameId });
        const res = await gamePost.
        find({ gameId }, {}, { skip, limit }).
        sort({ 'meta.updateAt': -1 }).
        populate('user').
        populate('lastReplyUser');

        ctx.body = { res, count };

    },
    sendNewPost: async (ctx) => {
        if (!ctx.session.user) {
            ctx.body = { code: 500 };
            return;
        }
        const { _id, gameId, title, content } = ctx.request.body;
        const user = ctx.session.user._id
        const res = await gamePost.findByIdAndUpdate(
            _id || mongoose.Types.ObjectId(),
            { $set: { gameId, title, content, user, 'meta.updateAt': Date.now() } },
            { upsert: true, new: true, setDefaultsOnInsert: true });

        ctx.body = { code: res.errors ? 500 : 200 }
    },
    getPostReply: async (ctx) => {
        const { postId, englishName, skip, limit } = ctx.request.body;

        const count = await gameReply.countDocuments({ postId });

        const res1 = gameCollection.findOne({ englishName });
        const res2 = gamePost.find({ _id: postId }).sort({ 'meta.updateAt': -1 }).populate('user');
        const res3 = await gameReply.
        find({ postId },{}, { skip, limit }).
        sort({ 'meta.updateAt': -1 }).
        populate('user')

        const res = await Promise.all([res1, res2, res3]).then(res => {
            res[0].titleImage = url(res[0].titleImage)
            return res
        });

        ctx.body = { res, count };
    },
    sendNewReply: async (ctx) => {
        if (!ctx.session.user) {
            ctx.body = { code: 500 };
            return;
        }
        const { _id, postId, content } = ctx.request.body;
        const user = ctx.session.user._id;
        //插入或更新回复
        const res1 = await gameReply.findByIdAndUpdate(
            _id || mongoose.Types.ObjectId(),
            { $set: { postId, content, user, 'meta.updateAt': Date.now() } },
            { upsert: true, new: true, setDefaultsOnInsert: true });
        //更新回复数量及最后回复人
        const res2 = await gamePost.findByIdAndUpdate(
            postId,
            {
                $set: {
                    lastReplyUser: user,
                    lastReplyAt: Date.now(),
                    'meta.updateAt': Date.now()
                },
                $inc: { replyCount: _id ? 0 : 1 }   //有_id即编辑时，不添加评论数量
            },
            { upsert: true, new: true, setDefaultsOnInsert: true });


        ctx.body = { code: (res1.errors && res2.errors) ? 500 : 200 }
    },
}

module.exports = gameObj;