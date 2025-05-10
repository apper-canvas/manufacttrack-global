import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import ProductionOrderForm from '../components/ProductionOrderForm';
import { getProductionOrders, saveProductionOrders } from '../services/productionService';
import ProductionStatusBadge from '../components/ProductionStatusBadge';

function Production() {
  const [productionOrders, setProductionOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Icon components
  const HomeIcon = getIcon('Home');
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash2');
  const RefreshCcwIcon = getIcon('RefreshCcw');
  const ClipboardListIcon = getIcon('ClipboardList');

  // Load production orders from localStorage
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const orders = getProductionOrders();
      setProductionOrders(orders);
      setIsLoading(false);
    }, 500); // Simulate loading for demo purposes
    
  }, []);

  // Save production orders to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('productionOrders', JSON.stringify(productionOrders));
    }
  }, [productionOrders, isLoading]);

    const updatedOrders = [...productionOrders, newOrder];
    setProductionOrders(updatedOrders);
    saveProductionOrders(updatedOrders);

  const handleAddOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProductionOrders([...productionOrders, newOrder]);
    setShowAddForm(false);
    toast.success('Production order added successfully!');
  };

  // Update an existing production order
  const handleUpdateOrder = (id, orderData) => {
    const updatedOrders = productionOrders.map(order => 
      order.id === id 
        ? { 
            ...order, 
            ...orderData, 
            updatedAt: new Date().toISOString() 
          } 
        : order
    );

    setProductionOrders(updatedOrders);
    saveProductionOrders(updatedOrders);

    setEditingOrder(null);
    toast.success('Production order updated successfully!');
  };

  // Delete a production order
  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this production order?')) {
      const updatedOrders = productionOrders.filter(order => order.id !== id);
      
      setProductionOrders(updatedOrders);
      saveProductionOrders(updatedOrders);

      toast.info('Production order deleted');
    }
  };

  // Filter orders based on selected tab and search term
  const getFilteredOrders = () => {
    return productionOrders
      .filter(order => {
        if (selectedTab === 'all') return true;
        return order.status === selectedTab;
      })
      .filter(order => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          order.productName.toLowerCase().includes(searchLower) ||
          order.workOrder.toLowerCase().includes(searchLower) ||
          order.customer.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = getFilteredOrders();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Production Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track and manage manufacturing production orders
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary transition-colors"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Tabs and Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-full md:w-64"
            />
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary flex items-center gap-2 py-2"
            onClick={() => {
              setEditingOrder(null);
              setShowAddForm(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Order</span>
          </motion.button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingOrder) && (
        <div className="mb-6 card p-4">
          <h2 className="text-lg font-semibold mb-4">
            {editingOrder ? 'Edit Production Order' : 'Add New Production Order'}
          </h2>
          <ProductionOrderForm
            initialData={editingOrder}
            onSubmit={editingOrder 
              ? (data) => handleUpdateOrder(editingOrder.id, data)
              : handleAddOrder
            }
            onCancel={() => {
              setShowAddForm(false);
              setEditingOrder(null);
            }}
          />
        </div>
      )}

      {/* Production Orders List */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCcwIcon className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
          <p>Loading production orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 card"
        >
          <ClipboardListIcon className="w-12 h-12 mx-auto mb-4 text-surface-400" />
          <h3 className="text-xl font-semibold mb-2">No Production Orders Found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            {searchTerm ? 'No orders match your search criteria' : 'Start by adding your first production order'}
          </p>
          {!showAddForm && (
            <button 
              className="btn btn-primary mx-auto"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Order
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredOrders.map(order => (
            <motion.div key={order.id} variants={itemVariants} className="card p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{order.productName}</h3>
                    <ProductionStatusBadge status={order.status} />
                  </div>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-1">Work Order: {order.workOrder}</p>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-1">Customer: {order.customer}</p>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-1">
                    Quantity: {order.quantity} {order.unit}
                  </p>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    Start Date: {format(new Date(order.startDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex gap-2 sm:self-end">
                  <button className="btn btn-outline py-1 px-3" onClick={() => setEditingOrder(order)}>
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button className="btn btn-outline py-1 px-3 text-red-500" onClick={() => handleDeleteOrder(order.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Production;