var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var gameReplySchema = new mongoose.Schema({
    postId: String,
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
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
gameReplySchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})

gameReplySchema.statics = {
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

module.exports = gameReplySchema