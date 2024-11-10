const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  isSold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);
     





