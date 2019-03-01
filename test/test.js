// Require the dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");

// Set environmental variable to 'test' during testing
process.env.NODE_ENV = "test";

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

// Test error handling
describe("GET /", () => {
  it("Returns incorrect endpoint", done => {
    chai
      .request(app)
      .get("/wrong")
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.have.string("");
        done(err);
      });
  });
});

// Test welcome message
describe("GET /", () => {
  it("Welcomes you to the API", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a("Object");
        expect(res.body.data).to.have.string("");
        done(err);
      });
  });
});
