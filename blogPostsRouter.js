const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;
const {BlogPost} = require('./models');

router.get('/', (req, res) => {
  BlogPost.find()
  .then(BlogPosts => res.json(
      BlogPosts.map(blogpost => blogpost.serialize())
  ))
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'})
  });
});

router.get('/:id', (req,res) => {
  BlogPost.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: err.message})
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];

  for (let field of requiredFields){
    if (!(field in req.body)){
      const message = `missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
    BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      author: {
        firstName: req.body.author.firstName,
        lastName: req.body.author.lastName
      }

      })
      .then(post => {
        return res.status(201).json(post.serialize())
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({message: err.message});
      });

})

router.put('/:id', jsonParser, (req, res) => {
  const id = req.params.id;
  const values = req.body;

  if(req.params.id !== values.id){
    const message = `id in request params (${req.params.id}) does not match id in request body (${values.id})`;
    console.error(message);
    return res.status(400).json(message);
  }

  console.log(`updating blog post with id of ${req.body.id}`);
  const postUpdate = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body){
      if(field === 'author'){
        if (req.body.author.firstName){
          postUpdate['author.firstName'] = req.body.author.firstName;
        }
        if (req.body.author.lastName){
          postUpdate['author.lastName'] = req.body.author.lastName;
        }
      } else {
        postUpdate[field] = req.body[field];
      }
    }
  });
  BlogPost.findByIdAndUpdate(req.params.id, {$set: postUpdate}, {new: true})
  .then(post => res.status(200).json(post))
  .catch(err => res.status(500).json({message: err.message}));
});

router.delete('/:id', (req, res) => {
  BlogPost.findByIdAndRemove(req.params.id)
  .then(post => {
    res.status(204).end();
    console.log(`deleted post with id of ${req.params.id}`);
  })
  .catch( err => res.status(500).json({message: err.message}));
});

module.exports = router;
