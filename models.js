const mongoose = require("mongoose");

const wineSchema = mongoose.Schema({
	Name: {type: String, required: true},d
	Appellation: {
		Name: String,
	}
})

const Wine = mongoose.model("Wine", wineSchema);
module.exports = {Wine};