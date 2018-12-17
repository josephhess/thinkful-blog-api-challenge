const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {
  before(function() {
    return runServer();
  });
  after(function () {
    return closeServer();
  })

  it('should return an array of blogpost objects on GET /', function () {
    return chai.request(app)
      .get('/blog-posts')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ['id', 'title', 'content', 'author'];
        res.body.forEach(function (post) {
          expect(post).to.be.a('object');
          expect(post).to.include.keys(expectedKeys);
        });
      });
  });




});
