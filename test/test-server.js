const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../server");

const should = chai.should();

chai.use(chaiHttp);

describe("/", function(){

	it("should return a 200 status code and HTML on GET", function(){
		return chai.request(app)
			.get("/")
			.then(function(res){
				res.should.have.status(200);
				res.should.be.html;
			});
	});
});