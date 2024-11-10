exports.listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
  
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ]
    };
  
    try {
      const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
  
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching transactions' });
    }
  };
  

// Statistics

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
  
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
  
    try {
      const totalSaleAmount = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, isSold: true } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
  
      const soldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, isSold: true });
      const notSoldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, isSold: false });
  
      res.status(200).json({
        totalSaleAmount: totalSaleAmount[0]?.total || 0,
        soldItemsCount,
        notSoldItemsCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching statistics' });
    }
  };

  
// Bar Chart data

exports.getPriceRangeData = async (req, res) => {
    const { month } = req.query;
  
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
  
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];
  
    try {
      const barData = await Promise.all(
        ranges.map(async (range) => {
          const count = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            price: { $gte: range.min, $lt: range.max }
          });
          return { range: `${range.min}-${range.max}`, count };
        })
      );
  
      res.status(200).json(barData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bar chart data' });
    }
  };



// Pie Chart data

exports.getCategoryData = async (req, res) => {
    const { month } = req.query;
  
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
  
    try {
      const categoryData = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
  
      res.status(200).json(categoryData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching category data' });
    }
  };
  
// fetch all api data

exports.getAllData = async (req, res) => {
    try {
      const month = req.query.month;
  
      const [transactions, statistics, barChart, pieChart] = await Promise.all([
        this.listTransactions({ query: { month } }),
        this.getStatistics({ query: { month } }),
        this.getPriceRangeData({ query: { month } }),
        this.getCategoryData({ query: { month } })
      ]);
  
      res.status(200).json({ transactions, statistics, barChart, pieChart });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching combined data' });
    }
  };
  