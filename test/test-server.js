const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer} = require("../server");

const should = chai.should();

chai.use(chaiHttp);

/*  1.  Make a request to /wineaux 
	2.  Inspect the response object and make sure it has default keys/values.
*/
describe("Wine List", function(){

	it("should return a 200 status code and HTML on GET", function(){
		return chai.request(app)
			.get("/")
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			});
	});

	it("should return search results on POST", function() {
		return chai.request(app)
			.post("/vault/search/malbec")
			.then(function (res){
				res.should.be.json;
				res.body.should.be.a('array')
				const expectedKeys = ['name', 'varietal', 'vintage', 'vineyard']
				res.body.forEach(function(item){
					item.should.be.a('object');
					item.should.include.keys(expectedKeys)
				})
			})
	});
});