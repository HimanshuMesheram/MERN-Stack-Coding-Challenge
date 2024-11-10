const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const databaseController = require('./controllers/databaseController');
app.get('/api/initialize', databaseController.initializeDatabase);

app.get('/api/transactions', transactionController.listTransactions);

app.get('/api/statistics', transactionController.getStatistics);

app.get('/api/bar-chart', transactionController.getPriceRangeData);

app.get('/api/pie-chart', transactionController.getCategoryData);

app.get('/api/all-data', transactionController.getAllData);



const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
