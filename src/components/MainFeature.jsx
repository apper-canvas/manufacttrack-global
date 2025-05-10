import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon components
  const BoxIcon = getIcon('Package');
  const ClipboardListIcon = getIcon('ClipboardList');
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const TruckIcon = getIcon('Truck');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortAscIcon = getIcon('ArrowUpDown');
  const RefreshCwIcon = getIcon('RefreshCw');

  // State for production orders
  const [productionOrders, setProductionOrders] = useState([
    { 
      id: 'PO-001', 
      customer: 'Acme Industries', 
      product: 'Industrial Valve A-240',
      quantity: 50,
      dueDate: '2023-09-25',
      status: 'in-progress',
      progress: 35,
      materials: [
        { name: 'Aluminum Sheet', available: true },
        { name: 'Steel Rods', available: true },
        { name: 'Control Circuitry', available: false },
      ]
    },
    { 
      id: 'PO-002', 
      customer: 'TechWorks LLC', 
      product: 'Precision Bearing B-100',
      quantity: 200,
      dueDate: '2023-09-30',
      status: 'planned',
      progress: 0,
      materials: [
        { name: 'Steel Alloy', available: true },
        { name: 'Lubricant X-20', available: true },
        { name: 'Packaging Materials', available: true },
      ]
    },
    { 
      id: 'PO-003', 
      customer: 'Global Manufacturing', 
      product: 'Custom Gear Assembly',
      quantity: 25,
      dueDate: '2023-09-20',
      status: 'completed',
      progress: 100,
      materials: [
        { name: 'Steel Plates', available: true },
        { name: 'Ball Bearings', available: true },
        { name: 'Mounting Brackets', available: true },
      ]
    },
    { 
      id: 'PO-004', 
      customer: 'Electic Components Inc', 
      product: 'Circuit Enclosure Type-C',
      quantity: 150,
      dueDate: '2023-10-05',
      status: 'on-hold',
      progress: 15,
      materials: [
        { name: 'Plastic Polymers', available: true },
        { name: 'Rubber Gaskets', available: false },
        { name: 'Fasteners', available: true },
      ]
    },
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: '',
    dueDate: '',
    materials: [{ name: '', available: true }]
  });
  
  // State for filtering and search
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Function to add material field
  const addMaterialField = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { name: '', available: true }]
    });
  };
  
  // Function to remove material field
  const removeMaterialField = (index) => {
    const newMaterials = [...formData.materials];
    newMaterials.splice(index, 1);
    setFormData({ ...formData, materials: newMaterials });
  };
  
  // Function to handle material input changes
  const handleMaterialChange = (index, e) => {
    const { name, value, checked, type } = e.target;
    const newMaterials = [...formData.materials];
    
    if (type === 'checkbox') {
      newMaterials[index].available = checked;
    } else {
      newMaterials[index].name = value;
    }
    
    setFormData({ ...formData, materials: newMaterials });
  };
  
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customer || !formData.product || !formData.quantity || !formData.dueDate) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    // Check if any material has empty name
    if (formData.materials.some(material => !material.name)) {
      toast.error("Please enter a name for all materials");
      return;
    }
    
    // Create new production order
    const newOrder = {
      id: `PO-00${productionOrders.length + 1}`,
      customer: formData.customer,
      product: formData.product,
      quantity: parseInt(formData.quantity),
      dueDate: formData.dueDate,
      status: 'planned',
      progress: 0,
      materials: formData.materials
    };
    
    // Add new order to state
    setProductionOrders([...productionOrders, newOrder]);
    
    // Close modal and reset form
    setIsModalOpen(false);
    setFormData({
      customer: '',
      product: '',
      quantity: '',
      dueDate: '',
      materials: [{ name: '', available: true }]
    });
    
    // Show success message
    toast.success("Production order added successfully");
  };
  
  // Function to handle order status update
  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = productionOrders.map(order => {
      if (order.id === id) {
        let progress = order.progress;
        
        // Update progress based on new status
        if (newStatus === 'planned') progress = 0;
        else if (newStatus === 'in-progress') progress = Math.max(order.progress, 10);
        else if (newStatus === 'on-hold') progress = order.progress;
        else if (newStatus === 'completed') progress = 100;
        
        return { ...order, status: newStatus, progress };
      }
      return order;
    });
    
    setProductionOrders(updatedOrders);
    toast.info(`Order ${id} updated to ${newStatus}`);
  };
  
  // Filter orders based on status and search term
  const filteredOrders = productionOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Sort filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'dueDate') {
      comparison = new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortField === 'customer') {
      comparison = a.customer.localeCompare(b.customer);
    } else if (sortField === 'progress') {
      comparison = a.progress - b.progress;
    } else if (sortField === 'quantity') {
      comparison = a.quantity - b.quantity;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Function to toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress updates for in-progress orders
      const updatedOrders = productionOrders.map(order => {
        if (order.status === 'in-progress' && order.progress < 100) {
          const newProgress = Math.min(order.progress + 1, 99);
          return { ...order, progress: newProgress };
        }
        return order;
      });
      
      setProductionOrders(updatedOrders);
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, [productionOrders]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'planned':
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          icon: ClipboardListIcon
        };
      case 'in-progress':
        return { 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: RefreshCwIcon
        };
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: CheckIcon
        };
      case 'on-hold':
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: AlertTriangleIcon
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: BoxIcon
        };
    }
  };

  // Get days until due date
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <ClipboardListIcon className="w-6 h-6 text-primary" />
            <span>Production Schedule</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage your manufacturing orders and track production progress
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Order</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-surface-500" />
            <span className="text-surface-700 dark:text-surface-300 font-medium">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'planned', 'in-progress', 'completed', 'on-hold'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SortAscIcon className="w-5 h-5 text-surface-500" />
            <span className="text-surface-700 dark:text-surface-300 font-medium">Sort:</span>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="px-3 py-1 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300"
            >
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="customer-asc">Customer (A-Z)</option>
              <option value="customer-desc">Customer (Z-A)</option>
              <option value="progress-asc">Progress (Low-High)</option>
              <option value="progress-desc">Progress (High-Low)</option>
              <option value="quantity-asc">Quantity (Low-High)</option>
              <option value="quantity-desc">Quantity (High-Low)</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Materials
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {sortedOrders.length > 0 ? (
                <AnimatePresence>
                  {sortedOrders.map((order, index) => {
                    const { color, icon: StatusIcon } = getStatusInfo(order.status);
                    const daysUntilDue = getDaysUntilDue(order.dueDate);
                    
                    return (
                      <motion.tr 
                        key={order.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-surface-50 dark:hover:bg-surface-700"
                        layoutId={order.id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col">
                            <span className="text-surface-700 dark:text-surface-300">
                              {new Date(order.dueDate).toLocaleDateString()}
                            </span>
                            <span className={`text-xs ${
                              daysUntilDue < 0 
                                ? 'text-red-600 dark:text-red-400' 
                                : daysUntilDue <= 3
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                            }`}>
                              {daysUntilDue < 0 
                                ? `${Math.abs(daysUntilDue)} days overdue` 
                                : daysUntilDue === 0 
                                  ? 'Due today'
                                  : `${daysUntilDue} days left`
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            <StatusIcon className="w-3.5 h-3.5 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mb-1">
                            <div 
                              className={`h-2.5 rounded-full ${
                                order.progress >= 100 
                                  ? 'bg-green-500' 
                                  : order.status === 'on-hold'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                              }`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-surface-600 dark:text-surface-400">
                            {order.progress}% Complete
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {order.materials.map((material, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${material.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-xs text-surface-700 dark:text-surface-300">
                                  {material.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {order.status !== 'completed' && (
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="text-xs px-2 py-1 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300"
                              >
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                              </select>
                            )}
                            {order.status === 'completed' && (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CheckIcon className="w-4 h-4" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-surface-500 dark:text-surface-400">
                    <div className="flex flex-col items-center justify-center">
                      <BoxIcon className="w-12 h-12 mb-2 text-surface-400" />
                      <p className="text-lg font-medium">No production orders found</p>
                      <p className="text-sm mt-1">
                        {searchTerm 
                          ? "Try adjusting your search or filters"
                          : "Click 'New Order' to create one"
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
      
      {/* Modal for adding new production order */}
      <AnimatePresence>
        {isModalOpen && (
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
                  Add New Production Order
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      placeholder="Enter customer name"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      min="1"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                      Required Materials
                    </label>
                    <button
                      type="button"
                      onClick={addMaterialField}
                      className="text-primary hover:text-primary-dark text-sm flex items-center gap-1 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Material
                    </button>
                  </div>
                  
                  <div className="space-y-3 mt-3">
                    {formData.materials.map((material, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={material.name}
                          onChange={(e) => handleMaterialChange(index, e)}
                          placeholder="Material name"
                          className="input-field flex-1"
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                            <input
                              type="checkbox"
                              checked={material.available}
                              onChange={(e) => handleMaterialChange(index, e)}
                              className="rounded text-primary focus:ring-primary"
                            />
                            Available
                          </label>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeMaterialField(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;