var mongoose = require("mongoose");
var gameReplySchema = require("../schemas/gameReply.js");
var gameReply = mongoose.model("gameReply",gameReplySchema,"gameReply");

module.exports = gameReply;
