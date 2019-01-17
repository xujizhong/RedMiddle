const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: String,
    password: String,                    //密码      
    email: String,                       //邮箱
    phone: String,                       //手机
    avatar: String,                      //头像
    email_verification_code: String,     //邮箱注册验证码
    email_verified: Boolean,             //邮箱是否验证
    email_verification_time_out: {       //邮箱注册验证码超时时间
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
usersSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})

/**
 * users表静态方法
 */
usersSchema.statics = {
    fetch: function () {
        return this
            .find({})
            .sort({ 'meta.updateAt': -1 })
    },
    findById: function (id) {
        return this
            .findOne({ _id: id })
    },
    findByData: function (data) {
        return this
            .findOne(data)
    },
    findByName: function (name) {
        return this
            .findOne({ name })
    },
    updateEmailVerifiedByName: function (name) {
        return this
            .updateOne(
                { "name": name },
                {
                    "$set": {
                        "email_verified": true,
                        email_verification_time_out: null
                    }
                }
            )
    }
}

module.exports = usersSchema