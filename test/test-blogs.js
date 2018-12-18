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

  it('should create a new blogpost on POST request', function () {
    const newPost = {
      title: 'post title test',
      content: 'heres the content',
      author: 'mark twain'
    };
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  it('should update a blogpost on PUT request', function () {
    const postUpdate = {
      title: 'updated post',
      content: 'updated content',
      author: 'not mark twain'
    };

    return chai.request(app)
      .get('/blog-posts')
      .then(function (res) {
        postUpdate.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${postUpdate.id}`)
          .send(postUpdate);
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(Object.assign({}, postUpdate, {publishDate: res.body.publishDate}));
      });

  });

  it('should delete an blogpost on DELETE request', function () {
    let getLength;
    let newLength;
    let id;
    return chai.request(app)
      .get('/blog-posts')
      .then(function (res) {
        getLength = res.body.length;
        id = res.body[0].id;
        return res;
      })
      .then(function(data) {
        return chai.request(app)
        .delete(`/blog-posts/${id}`)
        .then(function(res) {
          expect(res).to.have.status(204);
          return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
              expect(res.body.length).to.equal(getLength - 1);
            })
        })
      })
  })


});
