function main() {
      var message = "Hello world from JS!";
      console.log(message);
};
main();

function displayWines(products) {

    var resultElement = '';
    
    unirest.get('http://services.wine.com/api/beta2/service.svc/json/catalog?filter=categories(490+124)&offset=10&size=5&apikey=f252db84fcd4a163d84a5635f988a433')
        .end(function (response) {

            let products = [];
            let resultElement = "";

            for (let i = 0; i < response.body.Products.List.length; i++) {
                let product = response.body.Products.List[i];
                let newProduct = {};
                newProduct.name = product.Name;
                newProduct.varietal = product.Varietal;
                newProduct.vineyard = product.Vineyard;
                newProduct.vintage = product.Vintage;
                products.push(newProduct);
            }


            res.status(200).json(products);
        });
    
    if (products) {
        products.Search.forEach(function(product){
            resultElement += '<p>' + product.Name + '<p>';
        });
    }
    else{
        resultElement += '<p>No results</p>';
    }
    console.log(products);
    // $('.js-search-results').html(resultElement);
};
displayWines();