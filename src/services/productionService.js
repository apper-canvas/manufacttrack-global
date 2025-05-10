// Constants for localStorage keys
const PRODUCTION_ORDERS_KEY = 'productionOrders';

// Generate a unique ID for production orders
export const generateOrderId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PROD-${timestamp}-${randomPart}`;
};

// Get all production orders from localStorage
export const getProductionOrders = () => {
  const orders = localStorage.getItem(PRODUCTION_ORDERS_KEY);
  return orders ? JSON.parse(orders) : getSampleProductionOrders();
};

// Save production orders to localStorage
export const saveProductionOrders = (orders) => {
  localStorage.setItem(PRODUCTION_ORDERS_KEY, JSON.stringify(orders));
};

// Add a new production order
export const addProductionOrder = (orderData) => {
  const orders = getProductionOrders();
  const newOrder = {
    ...orderData,
    id: generateOrderId(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  saveProductionOrders(orders);
  
  return newOrder;
};

// Update an existing production order
export const updateProductionOrder = (id, orderData) => {
  const orders = getProductionOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex !== -1) {
    const updatedOrder = {
      ...orders[orderIndex],
      ...orderData,
      updatedAt: new Date().toISOString()
    };
    
    orders[orderIndex] = updatedOrder;
    saveProductionOrders(orders);
    return updatedOrder;
  }
  
  return null;
};

// Delete a production order
export const deleteProductionOrder = (id) => {
  const orders = getProductionOrders();
  const updatedOrders = orders.filter(order => order.id !== id);
  
  if (updatedOrders.length !== orders.length) {
    saveProductionOrders(updatedOrders);
    return true;
  }
  
  return false;
};

// Get sample production orders for initial data
const getSampleProductionOrders = () => {
  return [
    {
      id: 'PROD-00001',
      productName: 'Aluminum Enclosure Type A',
      workOrder: 'WO-2023-1542',
      customer: 'TechSolutions Inc.',
      quantity: 100,
      unit: 'pcs',
      startDate: '2023-09-15T00:00:00Z',
      endDate: '2023-09-30T00:00:00Z',
      status: 'completed',
      notes: 'Standard order with regular specifications',
      createdAt: '2023-09-10T08:30:00Z',
      updatedAt: '2023-10-02T14:15:00Z'
    },
    {
      id: 'PROD-00002',
      productName: 'Circuit Board Assembly X500',
      workOrder: 'WO-2023-1612',
      customer: 'ElectroPro Systems',
      quantity: 50,
      unit: 'pcs',
      startDate: '2023-09-25T00:00:00Z',
      endDate: '2023-10-15T00:00:00Z',
      status: 'in-progress',
      notes: 'Special coating required for marine environment',
      createdAt: '2023-09-20T10:15:00Z',
      updatedAt: '2023-09-26T11:30:00Z'
    },
    {
      id: 'PROD-00003',
      productName: 'Industrial Control Panel CP-200',
      workOrder: 'WO-2023-1655',
      customer: 'Factory Automation Ltd.',
      quantity: 25,
      unit: 'pcs',
      startDate: '2023-10-05T00:00:00Z',
      endDate: '2023-10-25T00:00:00Z',
      status: 'scheduled',
      notes: 'Custom firmware installation required',
      createdAt: '2023-09-28T09:45:00Z',
      updatedAt: '2023-09-28T09:45:00Z'
    },
    {
      id: 'PROD-00004',
      productName: 'Precision Steel Brackets',
      workOrder: 'WO-2023-1687',
      customer: 'Construction Partners Inc.',
      quantity: 200,
      unit: 'pcs',
      startDate: '2023-09-10T00:00:00Z',
      endDate: '2023-09-18T00:00:00Z',
      status: 'completed',
      notes: 'Quality check confirmed all specs met',
      createdAt: '2023-09-05T14:20:00Z',
      updatedAt: '2023-09-19T16:10:00Z'
    },
    {
      id: 'PROD-00005',
      productName: 'Hydraulic Valve Assembly HV-100',
      workOrder: 'WO-2023-1701',
      customer: 'FluidTech Industries',
      quantity: 30,
      unit: 'pcs',
      startDate: '2023-10-10T00:00:00Z',
      endDate: '2023-10-30T00:00:00Z',
      status: 'scheduled',
      notes: 'High-pressure testing required before shipping',
      createdAt: '2023-10-01T11:00:00Z',
      updatedAt: '2023-10-01T11:00:00Z'
    },
    {
      id: 'PROD-00006',
      productName: 'Custom Electronic Enclosures',
      workOrder: 'WO-2023-1720',
      customer: 'Telecom Systems Corp',
      quantity: 75,
      unit: 'pcs',
      startDate: '2023-09-20T00:00:00Z',
      endDate: '2023-10-15T00:00:00Z',
      status: 'in-progress',
      notes: 'Modified design as per client request on Sept 25',
      createdAt: '2023-09-15T13:40:00Z',
      updatedAt: '2023-09-25T10:25:00Z'
    }
  ];
};