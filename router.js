const router = require("express").Router();
let controller = require("./controller");

// This is already /vault as the root
router
    .route("/")
    .post(controller.saveWine);

router
    .route('/wines')
    .get(controller.getWines);

router
    .route('/wines/comment')
    .post(controller.addComment);

// This is /vault/search/:name
router
    .route("/search/:name")
    .post(controller.findByName)

// This is /vault/wine.com id
router
    .route("/:id")
    .post(controller.wineById)
    .delete(controller.deleteWine);

router
    .all("*")
    .use(controller.catchAll);

module.exports = router;