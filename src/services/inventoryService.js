// Constants for localStorage keys
const INVENTORY_ITEMS_KEY = 'manufacturingApp_inventoryItems';
const INVENTORY_MOVEMENTS_KEY = 'manufacturingApp_inventoryMovements';

// Generate a unique ID for inventory items
export const generateItemId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${timestamp}-${randomPart}`;
};

// Generate a unique ID for movements
export const generateMovementId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MOV-${timestamp}-${randomPart}`;
};

// Get all inventory items from localStorage
export const getInventoryItems = () => {
  const items = localStorage.getItem(INVENTORY_ITEMS_KEY);
  return items ? JSON.parse(items) : getSampleInventoryItems();
};

// Get all inventory movements from localStorage
export const getInventoryMovements = () => {
  const movements = localStorage.getItem(INVENTORY_MOVEMENTS_KEY);
  return movements ? JSON.parse(movements) : getSampleInventoryMovements();
};

// Save inventory items to localStorage
export const saveInventoryItems = (items) => {
  localStorage.setItem(INVENTORY_ITEMS_KEY, JSON.stringify(items));
};

// Save inventory movements to localStorage
export const saveInventoryMovements = (movements) => {
  localStorage.setItem(INVENTORY_MOVEMENTS_KEY, JSON.stringify(movements));
};

// Add a new inventory item
export const addInventoryItem = (item) => {
  const items = getInventoryItems();
  const newItem = {
    ...item,
    id: generateItemId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  items.push(newItem);
  saveInventoryItems(items);
  
  // Create an initial stock movement for the new item
  addInventoryMovement({
    itemId: newItem.id,
    itemName: newItem.name,
    type: 'initial',
    quantity: newItem.quantity,
    date: new Date().toISOString(),
    notes: 'Initial inventory setup'
  });
  
  return newItem;
};

// Add inventory movement
export const addInventoryMovement = (movement) => {
  const movements = getInventoryMovements();
  const newMovement = {
    ...movement,
    id: generateMovementId(),
    timestamp: new Date().toISOString()
  };
  
  movements.push(newMovement);
  saveInventoryMovements(movements);
  
  // Update item quantity
  updateItemQuantity(movement.itemId, movement.type, movement.quantity);
  
  return newMovement;
};

// Update item quantity based on movement type
const updateItemQuantity = (itemId, movementType, quantity) => {
  const items = getInventoryItems();
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    const item = items[itemIndex];
    
    switch (movementType) {
      case 'initial':
        // Initial setup, quantity is set directly
        break;
      case 'addition':
        item.quantity += quantity;
        break;
      case 'withdrawal':
        item.quantity -= quantity;
        break;
      case 'adjustment':
        item.quantity = quantity;
        break;
      default:
        break;
    }
    
    item.updatedAt = new Date().toISOString();
    items[itemIndex] = item;
    saveInventoryItems(items);
  }
};

// Get sample inventory items for initial data
const getSampleInventoryItems = () => {
  return [
    {
      id: 'INV-00001',
      name: 'Aluminum Sheet (4ft x 8ft)',
      category: 'Raw Materials',
      description: 'Standard aluminum sheet for manufacturing',
      quantity: 120,
      unit: 'sheet',
      reorderPoint: 20,
      location: 'Warehouse A, Rack 12',
      supplier: 'Metal Supplies Inc.',
      cost: 45.99,
      createdAt: '2023-08-15T08:30:00Z',
      updatedAt: '2023-09-02T14:15:00Z'
    },
    {
      id: 'INV-00002',
      name: 'Steel Rods (12mm)',
      category: 'Raw Materials',
      description: '12mm steel rods for structural components',
      quantity: 350,
      unit: 'rod',
      reorderPoint: 50,
      location: 'Warehouse A, Rack 8',
      supplier: 'Steel Dynamics Corp',
      cost: 12.75,
      createdAt: '2023-08-10T09:45:00Z',
      updatedAt: '2023-09-01T11:20:00Z'
    },
    {
      id: 'INV-00003',
      name: 'Control Circuitry PCB',
      category: 'Electronics',
      description: 'Pre-assembled control circuit boards',
      quantity: 85,
      unit: 'piece',
      reorderPoint: 15,
      location: 'Secure Storage, Cabinet 3',
      supplier: 'Tech Electronics Ltd.',
      cost: 67.50,
      createdAt: '2023-08-20T10:15:00Z',
      updatedAt: '2023-08-28T16:30:00Z'
    },
  ];
};

// Get sample inventory movements for initial data
const getSampleInventoryMovements = () => {
  return [
    {
      id: 'MOV-00001',
      itemId: 'INV-00001',
      itemName: 'Aluminum Sheet (4ft x 8ft)',
      type: 'initial',
      quantity: 100,
      date: '2023-08-15T08:30:00Z',
      notes: 'Initial inventory setup',
      timestamp: '2023-08-15T08:30:00Z'
    },
    {
      id: 'MOV-00002',
      itemId: 'INV-00001',
      itemName: 'Aluminum Sheet (4ft x 8ft)',
      type: 'addition',
      quantity: 20,
      date: '2023-09-02T14:15:00Z',
      notes: 'Order from Metal Supplies Inc.',
      timestamp: '2023-09-02T14:15:00Z'
    },
    {
      id: 'MOV-00003',
      itemId: 'INV-00002',
      itemName: 'Steel Rods (12mm)',
      type: 'initial',
      quantity: 300,
      date: '2023-08-10T09:45:00Z',
      notes: 'Initial inventory setup',
      timestamp: '2023-08-10T09:45:00Z'
    },
    {
      id: 'MOV-00004',
      itemId: 'INV-00002',
      itemName: 'Steel Rods (12mm)',
      type: 'addition',
      quantity: 50,
      date: '2023-09-01T11:20:00Z',
      notes: 'Replenishment order',
      timestamp: '2023-09-01T11:20:00Z'
    },
    {
      id: 'MOV-00005',
      itemId: 'INV-00003',
      itemName: 'Control Circuitry PCB',
      type: 'initial',
      quantity: 85,
      date: '2023-08-20T10:15:00Z',
      notes: 'Initial inventory setup',
      timestamp: '2023-08-20T10:15:00Z'
    }
  ];
};