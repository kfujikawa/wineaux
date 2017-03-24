const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer} = require("../server");

const should = chai.should();

chai.use(chaiHttp);

/*  1.  Make a request to /wineaux 
	2.  Inspect the response object and make sure it has default keys/values.
*/
// describe("Homepage Render", function(){

// before(function(){
// 	return runServer();
// })

// after(function(){
// 	return closeServer;
// })

// 	it("should return a 200 status code and HTML on GET", function(){
// 		return chai.request(app)
// 			.get("/wineaux")
// 			.then(function(res){
// 				res.should.have.status(200);
// 				res.should.be.html;
// 			});
// 	});
// });