const express = require('express');
const morgan = require('morgan');
const app = express();
const blogPostsRouter = require('./blogPostsRouter');

app.use(express.json());
app.use(morgan('common'));
app.use('/blog-posts', blogPostsRouter);

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`App is listening on ${port}`);
        resolve(server);
      })
      .on("error", err => reject(err))
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing Server');
    server.close(err => {
      if(err) {
        reject(err);
        return;
      }
      resolve();
    })
  });
}

if(require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
