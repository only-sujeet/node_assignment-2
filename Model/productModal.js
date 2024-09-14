const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String], 
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
