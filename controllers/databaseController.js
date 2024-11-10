const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(transactions); // Insert new data

    res.status(200).send({ message: 'Database initialized with seed data.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to initialize database' });
  }
};
