var mongoose = require("mongoose");
var gameTypeSchema = require("../schemas/gameType.js");
var gameType = mongoose.model("gameType",gameTypeSchema,"gameType");

module.exports = gameType;
