let Wine = require("./schema");
let unirest = require("unirest");
let Comment = require("./comment");
let controller = {};

controller.getWines = function (req, res) {};

// Search wine.com api using query
controller.findByName = function (req, res) {
    unirest
        .get(`http://services.wine.com/api/beta2/service.svc/json/catalog?search=${req.params.name}&apikey=f252db84fcd4a163d84a5635f988a433`)
        .end(function (response) {
            let products = [];
            let resultElement = "";
            for (let i = 0; i < response.body.Products.List.length; i++) {
                let product = response.body.Products.List[i];
                let newProduct = {};
                newProduct.id = product.Id;
                newProduct.name = product.Name;
                newProduct.varietal = product.Varietal;
                newProduct.vineyard = product.Vineyard;
                newProduct.vintage = product.Vintage;
                products.push(newProduct);
            }

            res
                .status(200)
                .json(products);
        });

}

// GET wine by id
controller.wineById = function (req, res) {

    unirest
        .get(`http://services.wine.com/api/beta2/service.svc/json/catalog?filter=product(${req.params.id})&apikey=f252db84fcd4a163d84a5635f988a433`)
        .end(function (response) {

            let product = response.body.Products.List[0];
            let newProduct = {};
            newProduct.name = product.Name;
            newProduct.varietal = product.Varietal;
            newProduct.vineyard = product.Vineyard;
            newProduct.vintage = product.Vintage;

            Comment.findOne({
                wine_id: product.Id
            }, function (error, comments) {
                if (error) {
                    console.log(error);
                } else {
                    newProduct.comments = comments;
                    res
                        .status(200)
                        .json(newProduct);
                }
            });
        });

}

controller.saveWine = function (req, res) {
    var wines = req.session.wines || [];

    wines.push(req.body);
    res
        .status(201)
        .json(wines);
}
// POST
controller.addComment = function (req, res) {

    Comment
        .create({
            wine_id: req.body.wine_id,
            comment: req.body.comment
        }, function (error, created) {
            if (error) {
                console.log(error);
            } else {
                res
                    .status(201)
                    .end();
            }
        });

}

// PUT (updating a comment) CATCH ALL ENDPOINT
controller.catchAll = function (req, res) {
    res
        .status(404)
        .json({message: "Not Found"});
}

module.exports = controller;