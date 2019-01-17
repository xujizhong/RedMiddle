const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var gamePostSchema = new mongoose.Schema({
    gameId: String,
    title: String,
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    replyCount: {
        type: Number,
        default: 0
    },
    lastReplyUser: { type: Schema.Types.ObjectId, ref: 'users' },
    lastReplyAt: {
        type: Date,
        default: Date.now
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        }
    }
}, { versionKey: false });

/**
 * 保存时更改创建时间和修改时间
 */
gamePostSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})

gamePostSchema.statics = {
    fetch: function () {
        return this
            .find({})
            .sort({ 'sort': 1 })
    },
    findById: function (id) {
        return this
            .findOne({ _id: id })
    },
    deleteById: function (id) {
        return this
            .findByIdAndRemove(id)
    }
}

module.exports = gamePostSchema