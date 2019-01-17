var mongoose = require("mongoose");

var gameCollectionSchema = new mongoose.Schema({
    name: String,
    englishName: String,
    type: String,
    sort: Number,
    image: String,
    titleImage: String,
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
gameCollectionSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})

gameCollectionSchema.statics = {
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

module.exports = gameCollectionSchema