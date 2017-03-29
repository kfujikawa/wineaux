let Wine = require("./schema");
let unirest = require("unirest");
let Comment = require("./comment");
let controller = {};

controller.getWines = function (req, res) {
    console.log('get wines');
    if (req.session.hasOwnProperty('wines')) {
        return res
            .status(200)
            .json(req.session.wines);
    }

    res
        .status(200)
        .json([]);
};

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

// POST save wine to vault and add comment per wine
controller.saveWine = function (req, res) {

    req.session.wines = req.session.wines || [];

    const wines = req.session.wines;
    if (wines.length) {
        for (var i = 0; i < wines.length; i += 1) {
            if (wines[i].id === req.body.id) {
                res
                    .status(500)
                    .json({message: "That wine already exists"});
            }
        }
    }

    req
        .session
        .wines
        .push(req.body);
    res
        .status(201)
        .json(req.session.wines);
}

controller.addComment = function (req, res) {

    req.session.wines = req.session.wines || [];

    const wines = req.session.wines;

    if (wines.length) {
        for (var i = 0; i < wines.length; i += 1) {
            if (parseInt(wines[i].id) === parseInt(req.body.id)) {

                delete req.body.id;
                wines[i].comments = wines[i].comments || [];
                wines[i]
                    .comments
                    .push(req.body);
                res
                    .status(201)
                    .json(wines);
            }
        }
    }
}


// DELETE

// PUT update comment


controller.catchAll = function (req, res) {
    res
        .status(404)
        .json({message: "Not Found"});
}

module.exports = controller;