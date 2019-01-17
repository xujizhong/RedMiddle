const mongoose = require("mongoose");
const usersSchema = require("../schemas/users.js");
const users = mongoose.model("users", usersSchema, "users");

const db = mongoose.connection;

/**
 * 创建用户名唯一索引
 */
db.collections.users.createIndex(
    { "name": 1 },
    { unique: true }
);
/**
* 创建邮箱唯一索引
*/
db.collections.users.createIndex(
    { "email": 1 },
    { unique: true }
);
/**
 * 创建超时索引
 */
db.collections.users.createIndex(
    { "email_verification_time_out": 1 },
    { expireAfterSeconds: 24 * 60 * 60 }
);


module.exports = users;
