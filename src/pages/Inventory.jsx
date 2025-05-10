import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import { 
  getInventoryItems, 
  getInventoryMovements, 
  addInventoryItem, 
  addInventoryMovement 
} from '../services/inventoryService';

function Inventory() {
  // State for inventory data
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryMovements, setInventoryMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for UI controls
  const [activeTab, setActiveTab] = useState('items');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // State for form data
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: '',
    unit: '',
    reorderPoint: '',
    location: '',
    supplier: '',
    cost: ''
  });
  
  const [movementFormData, setMovementFormData] = useState({
    itemId: '',
    type: 'addition',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  // Get icons
  const BoxIcon = getIcon('Package');
  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const XIcon = getIcon('X');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortAscIcon = getIcon('ArrowUpDown');
  const RefreshCwIcon = getIcon('RefreshCw');
  const ClipboardIcon = getIcon('Clipboard');
  const HistoryIcon = getIcon('History');
  const WarehouseIcon = getIcon('Warehouse');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const EditIcon = getIcon('Edit');
  const CheckIcon = getIcon('Check');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const AdjustmentsIcon = getIcon('SlidersHorizontal');
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = getInventoryItems();
        const movements = getInventoryMovements();
        
        setInventoryItems(items);
        setInventoryMovements(movements);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading inventory data:', error);
        toast.error('Failed to load inventory data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Functions to handle form input changes
  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemFormData({
      ...itemFormData,
      [name]: name === 'quantity' || name === 'reorderPoint' || name === 'cost' 
        ? parseFloat(value) || '' 
        : value
    });
  };
  
  const handleMovementInputChange = (e) => {
    const { name, value } = e.target;
    setMovementFormData({
      ...movementFormData,
      [name]: name === 'quantity' ? parseFloat(value) || '' : value
    });
  };
  
  // Function to handle item form submission
  const handleItemSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!itemFormData.name || itemFormData.quantity === '' || !itemFormData.unit) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    try {
      // Add new inventory item
      const newItem = addInventoryItem(itemFormData);
      
      // Update local state
      setInventoryItems([...inventoryItems, newItem]);
      
      // Close modal and reset form
      setIsItemModalOpen(false);
      setItemFormData({
        name: '',
        category: '',
        description: '',
        quantity: '',
        unit: '',
        reorderPoint: '',
        location: '',
        supplier: '',
        cost: ''
      });
      
      // Show success message
      toast.success(`Inventory item "${newItem.name}" added successfully`);
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
    }
  };
  
  // Function to handle movement form submission
  const handleMovementSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!movementFormData.itemId || movementFormData.quantity === '' || !movementFormData.date) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    try {
      const selectedItem = inventoryItems.find(item => item.id === movementFormData.itemId);
      
      // Check if withdrawal is valid
      if (movementFormData.type === 'withdrawal' && movementFormData.quantity > selectedItem.quantity) {
        toast.error(`Cannot withdraw more than available quantity (${selectedItem.quantity} ${selectedItem.unit}s)`);
        return;
      }
      
      // Add new inventory movement
      const newMovement = addInventoryMovement({
        ...movementFormData,
        itemName: selectedItem.name
      });
      
      // Update inventory items with new quantities
      const updatedItems = getInventoryItems();
      setInventoryItems(updatedItems);
      
      // Update inventory movements
      setInventoryMovements([...inventoryMovements, newMovement]);
      
      // Close modal and reset form
      setIsMovementModalOpen(false);
      setMovementFormData({
        itemId: '',
        type: 'addition',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      // Show success message
      toast.success(`Inventory ${movementFormData.type} recorded successfully`);
    } catch (error) {
      console.error('Error recording inventory movement:', error);
      toast.error('Failed to record inventory movement');
    }
  };
  
  // Function to open movement modal with pre-selected item
  const openMovementModal = (item) => {
    setSelectedItem(item);
    setMovementFormData({
      ...movementFormData,
      itemId: item.id
    });
    setIsMovementModalOpen(true);
  };
  
  // Function to toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get unique categories for filtering
  const categories = ['all', ...new Set(inventoryItems.map(item => item.category))].filter(Boolean);
  
  // Filter items based on category and search term
  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      comparison = (a.category || '').localeCompare(b.category || '');
    } else if (sortField === 'quantity') {
      comparison = a.quantity - b.quantity;
    } else if (sortField === 'cost') {
      comparison = (a.cost || 0) - (b.cost || 0);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Get movement type info (icon, color)
  const getMovementTypeInfo = (type) => {
    switch (type) {
      case 'addition':
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: ArrowUpIcon
        };
      case 'withdrawal':
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: ArrowDownIcon
        };
      case 'adjustment':
        return { 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: AdjustmentsIcon
        };
      case 'initial':
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          icon: ClipboardIcon
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: BoxIcon
        };
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 500, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-surface-50 dark:bg-surface-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <BoxIcon className="w-7 h-7 text-primary" />
              <span>Inventory Management</span>
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Track and manage your inventory items and stock levels
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'items'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700'
              }`}
            >
              <BoxIcon className="w-5 h-5" />
              <span>Inventory Items</span>
            </button>
            
            <button
              onClick={() => setActiveTab('movements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'movements'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700'
              }`}
            >
              <HistoryIcon className="w-5 h-5" />
              <span>Movement History</span>
            </button>
          </div>
        </div>
        
        {/* Inventory Items Tab */}
        {activeTab === 'items' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-5 h-5 text-surface-500" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsMovementModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-800 dark:bg-surface-700 hover:bg-surface-700 dark:hover:bg-surface-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCwIcon className="w-5 h-5" />
                  <span>Record Movement</span>
                </button>
                
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead className="bg-surface-50 dark:bg-surface-800">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Item Name</span>
                          {sortField === 'name' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('category')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Category</span>
                          {sortField === 'category' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('quantity')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Quantity</span>
                          {sortField === 'quantity' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-surface-500">
                          <div className="flex items-center justify-center">
                            <RefreshCwIcon className="w-5 h-5 animate-spin mr-2" />
                            <span>Loading inventory data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : sortedItems.length > 0 ? (
                      sortedItems.map((item) => (
                        <motion.tr 
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="hover:bg-surface-50 dark:hover:bg-surface-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium text-surface-900 dark:text-white">{item.name}</span>
                              <span className="text-xs text-surface-500">{item.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                            {item.category || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium text-surface-900 dark:text-white">{item.quantity}</span>
                              {item.reorderPoint && (
                                <span className={`text-xs ${
                                  item.quantity <= item.reorderPoint
                                    ? 'text-red-600 dark:text-red-400 flex items-center'
                                    : 'text-surface-500'
                                }`}>
                                  {item.quantity <= item.reorderPoint && <AlertTriangleIcon className="w-3 h-3 mr-1" />}
                                  Reorder at: {item.reorderPoint}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                            {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                            {item.location || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                            {item.supplier || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openMovementModal(item)}
                                className="p-1 text-primary hover:text-primary-dark transition-colors"
                                title="Record movement"
                              >
                                <RefreshCwIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-surface-500 dark:text-surface-400">
                          <div className="flex flex-col items-center justify-center">
                            <BoxIcon className="w-12 h-12 mb-2 text-surface-400" />
                            <p className="text-lg font-medium">No inventory items found</p>
                            <p className="text-sm mt-1">
                              {searchTerm || filterCategory !== 'all'
                                ? "Try adjusting your search or filters"
                                : "Click 'Add Item' to create one"
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Inventory Movements Tab */}
        {activeTab === 'movements' && (
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-primary" />
                <span>Inventory Movement History</span>
              </h2>
              
              <button
                onClick={() => setIsMovementModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Movement</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-surface-500">
                        <div className="flex items-center justify-center">
                          <RefreshCwIcon className="w-5 h-5 animate-spin mr-2" />
                          <span>Loading movement data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : inventoryMovements.length > 0 ? (
                    [...inventoryMovements]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((movement) => {
                        const { color, icon: MovementIcon } = getMovementTypeInfo(movement.type);
                        
                        return (
                          <motion.tr 
                            key={movement.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="hover:bg-surface-50 dark:hover:bg-surface-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                              {format(new Date(movement.date), 'PPP')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                              {movement.itemName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                                <MovementIcon className="w-3.5 h-3.5 mr-1" />
                                {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                              {movement.quantity}
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-700 dark:text-surface-300 max-w-xs truncate">
                              {movement.notes || '-'}
                            </td>
                          </motion.tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-surface-500 dark:text-surface-400">
                        <div className="flex flex-col items-center justify-center">
                          <HistoryIcon className="w-12 h-12 mb-2 text-surface-400" />
                          <p className="text-lg font-medium">No movement history found</p>
                          <p className="text-sm mt-1">Record your first inventory movement</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal for adding new inventory item */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                  <PlusIcon className="w-5 h-5 text-primary" />
                  Add New Inventory Item
                </h3>
                <button 
                  onClick={() => setIsItemModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleItemSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={itemFormData.name}
                      onChange={handleItemInputChange}
                      placeholder="Enter item name"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={itemFormData.category}
                      onChange={handleItemInputChange}
                      placeholder="E.g., Raw Materials, Electronics"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={itemFormData.description}
                      onChange={handleItemInputChange}
                      placeholder="Enter item description"
                      rows="2"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Initial Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={itemFormData.quantity}
                      onChange={handleItemInputChange}
                      placeholder="Enter quantity"
                      min="0"
                      step="0.01"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Unit *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={itemFormData.unit}
                      onChange={handleItemInputChange}
                      placeholder="E.g., piece, kg, liter"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Reorder Point
                    </label>
                    <input
                      type="number"
                      name="reorderPoint"
                      value={itemFormData.reorderPoint}
                      onChange={handleItemInputChange}
                      placeholder="Minimum quantity before reordering"
                      min="0"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Cost
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={itemFormData.cost}
                      onChange={handleItemInputChange}
                      placeholder="Cost per unit"
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={itemFormData.location}
                      onChange={handleItemInputChange}
                      placeholder="E.g., Warehouse A, Shelf B3"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={itemFormData.supplier}
                      onChange={handleItemInputChange}
                      placeholder="Enter supplier name"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal for recording inventory movement */}
      <AnimatePresence>
        {isMovementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                  <RefreshCwIcon className="w-5 h-5 text-primary" />
                  Record Inventory Movement
                </h3>
                <button 
                  onClick={() => setIsMovementModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleMovementSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Select Item *
                    </label>
                    <select
                      name="itemId"
                      value={movementFormData.itemId}
                      onChange={handleMovementInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">-- Select an item --</option>
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.quantity} {item.unit}s available)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Movement Type *
                    </label>
                    <div className="flex gap-4">
                      {['addition', 'withdrawal', 'adjustment'].map(type => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={movementFormData.type === type}
                            onChange={handleMovementInputChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-surface-700 dark:text-surface-300 capitalize">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={movementFormData.quantity}
                      onChange={handleMovementInputChange}
                      placeholder="Enter quantity"
                      min="0.01"
                      step="0.01"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={movementFormData.date}
                      onChange={handleMovementInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={movementFormData.notes}
                      onChange={handleMovementInputChange}
                      placeholder="Add any additional notes"
                      rows="2"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsMovementModalOpen(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Record Movement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Inventory;