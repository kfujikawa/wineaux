const mongoose = require("mongoose");
const schema = mongoose.Schema;

const wineSchema = schema({
	wine_id: Number
});

const Wine = mongoose.model("Wine", wineSchema);
module.exports = {Wine};