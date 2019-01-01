const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  userName: {
    type: String,
    required: true,
    unique: true
  }
});

const Author = mongoose.model('Author', authorSchema);

module.exports = { Author };
