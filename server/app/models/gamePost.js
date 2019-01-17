var mongoose = require("mongoose");
var gamePostSchema = require("../schemas/gamePost.js");
var gamePost = mongoose.model("gamePost",gamePostSchema,"gamePost");

module.exports = gamePost;
