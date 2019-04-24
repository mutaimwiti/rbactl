const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticleSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Article', ArticleSchema);
