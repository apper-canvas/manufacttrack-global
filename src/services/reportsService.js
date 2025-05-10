// Generate random data for reports
const generateRandomData = (min, max, count) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

// Generate dates for the last n days/months
const generateDates = (count, type = 'days') => {
  const dates = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    if (type === 'days') {
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    } else if (type === 'months') {
      date.setMonth(date.getMonth() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }
  }
  
  return dates;
};

const getInventoryAnalytics = () => {
  const categories = ['Raw Materials', 'Work in Progress', 'Finished Goods', 'Packaging'];
  const stockLevels = generateRandomData(50, 200, 4);
  const reorderPoints = generateRandomData(20, 60, 4);
  
  // Trends over last 6 months
  const months = generateDates(6, 'months');
  const stockTrends = categories.map(category => ({
    name: category,
    data: generateRandomData(30, 220, 6)
  }));
  
  return {
    currentStock: {
      categories,
      series: [{
        name: 'Current Stock',
        data: stockLevels
      }, {
        name: 'Reorder Point',
        data: reorderPoints
      }]
    },
    trends: {
      categories: months,
      series: stockTrends
    },
    topItems: [
      { name: 'Aluminum Sheets', value: 187, change: 12 },
      { name: 'Steel Rods', value: 143, change: -8 },
      { name: 'Electronic Components', value: 98, change: 25 },
      { name: 'Plastic Casings', value: 76, change: 5 }
    ]
  };
};

const getProductionAnalytics = () => {
  const days = generateDates(14, 'days');
  const productionOutput = generateRandomData(80, 150, 14);
  const defectRate = generateRandomData(1, 8, 14).map(num => num / 10); // 0.1 to 0.8%
  
  return {
    output: {
      categories: days,
      series: [{
        name: 'Units Produced',
        data: productionOutput
      }]
    },
    quality: {
      categories: days,
      series: [{
        name: 'Defect Rate (%)',
        data: defectRate
      }]
    },
    efficiency: {
      value: 87,
      target: 92,
      previous: 84
    },
    topProducts: [
      { name: 'Product A', units: 543, change: 15 },
      { name: 'Product B', units: 412, change: -3 },
      { name: 'Product C', units: 287, change: 7 }
    ]
  };
};

const getWorkforceAnalytics = () => {
  return {
    attendance: {
      present: 92,
      absent: 5,
      leave: 3
    },
    departments: {
      labels: ['Production', 'Assembly', 'Quality', 'Packaging', 'Maintenance'],
      series: [42, 28, 14, 12, 8]
    },
    productivity: {
      categories: generateDates(7, 'days'),
      series: [{
        name: 'Productivity (%)',
        data: generateRandomData(75, 95, 7)
      }]
    }
  };
};

const getCustomerAnalytics = () => {
  const months = generateDates(6, 'months');
  
  return {
    orders: {
      categories: months,
      series: [{
        name: 'Orders',
        data: generateRandomData(40, 80, 6)
      }]
    },
    satisfaction: 87,
    regions: {
      labels: ['North', 'South', 'East', 'West', 'International'],
      series: [35, 25, 20, 15, 5]
    }
  };
};

export { getInventoryAnalytics, getProductionAnalytics, getWorkforceAnalytics, getCustomerAnalytics };