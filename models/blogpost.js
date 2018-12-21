"use strict";

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({

  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  }
});

blogSchema.set('timestamps', true);

blogSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.createdAt,
    updated: this.updatedAt
  }
}

const BlogPost = mongoose.model("BlogPost", blogSchema);
module.exports = { BlogPost };

