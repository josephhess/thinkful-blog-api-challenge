const express = require('express');
const morgan = require('morgan');

const {BlogPosts} = require('./models');

const app = express();
app.use(morgan('common'));

const blogPostsRouter = require('./blogPostsRouter');

app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, ()=> {
  console.log(`your app is listening on port ${process.env.PORT} || 8080`);
})
