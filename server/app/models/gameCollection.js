var mongoose = require("mongoose");
var gameCollectionSchema = require("../schemas/gameCollection.js");
var gameCollection = mongoose.model("gameCollection",gameCollectionSchema,"gameCollection");

const db = mongoose.connection;

/**
 * 创建英文名唯一索引
 */
db.collections.gameCollection.createIndex(
    { "englishName": 1 },
    { unique: true }
);

module.exports = gameCollection;
