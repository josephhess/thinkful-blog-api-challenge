const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


BlogPosts.create(
  'test post 1', 'this is the test content', 'jojo'
  );
BlogPosts.create(
  'test post 2', 'this is more test content', 'john wayne'
  );

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];

  for (let field of requiredFields){
    if (!(field in req.body)){
      const message = `missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
    const post = BlogPosts.create(
        req.body.title, req.body.content, req.body.author, req.body.publishedDate
      )
    return res.status(201).json(post);
  }
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];
  const id = req.params.id;
  const values = req.body;

  for (let field of requiredFields){
    if (!(field in values)){
      const message = `missing "${field}" in request body`;
      console.error(message);
      return res.status(400).json(message);
    }
  }
  if(req.params.id !== values.id){
    const message = `id in request params (${req.params.id}) does not match id in request body (${values.id})`;
    console.error(message);
    return res.status(400).json(message);
  }
  console.log(`updating blog post with id of ${req.body.id}`);
  const updatedPost = BlogPosts.update({
    id: values.id,
    title: values.title,
    content: values.content,
    author: values.author
    })
  res.status(200).json(updatedPost);
})

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`deleted post with id of ${req.params.id}`);
  res.status(204).end();
})

module.exports = router;
