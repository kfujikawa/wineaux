const mongoose = require("mongoose");

const wineSchema = mongoose.Schema({

})

const Wine = mongoose.model("Wine", wineSchema);
module.exports = {Wine};