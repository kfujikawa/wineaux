const router = require("express").Router();
let controller = require("./controller");

// This is already /vault as the root
router.route("/")
    .get(controller.getWines)
    .post(controller.addComment);

// This is /vault/search/:name
router.route("/search/:name")
	.post(controller.findByName)

// This is /vault/wine.com id
router.route("/:id")
    .get(controller.wineById);

router.all("*")
	.use(controller.catchAll);

module.exports = router;