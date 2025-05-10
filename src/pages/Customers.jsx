import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import CustomerForm from '../components/CustomerForm';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customersService';

function Customers() {
  // State management
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Icon components
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const UserIcon = getIcon('User');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const BuildingIcon = getIcon('Building');
  const UserRoundIcon = getIcon('UserRound');
  const PhoneIcon = getIcon('Phone');
  const MailIcon = getIcon('Mail');
  const MapPinIcon = getIcon('MapPin');
  const CalendarIcon = getIcon('Calendar');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const ActivityIcon = getIcon('Activity');
  const InfoIcon = getIcon('Info');

  // Load customers on component mount
  useEffect(() => {
    const loadedCustomers = getCustomers();
    setCustomers(loadedCustomers);
    setFilteredCustomers(loadedCustomers);
  }, []);

  // Filter customers based on search term and filters
  useEffect(() => {
    let results = customers;
    
    // Apply search term filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(customer => 
        customer.name.toLowerCase().includes(lowercasedTerm) ||
        customer.contactPerson.toLowerCase().includes(lowercasedTerm) ||
        customer.email.toLowerCase().includes(lowercasedTerm) ||
        customer.notes.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(customer => customer.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'All') {
      results = results.filter(customer => customer.type === typeFilter);
    }
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCustomers(results);
  }, [customers, searchTerm, statusFilter, typeFilter, sortConfig]);

  // Handle adding a new customer
  const handleAddCustomer = (customerData) => {
    const newCustomer = addCustomer(customerData);
    setCustomers(prev => [...prev, newCustomer]);
    setIsAddingCustomer(false);
  };

  // Handle updating an existing customer
  const handleUpdateCustomer = (customerData) => {
    const updatedCustomer = updateCustomer(customerData);
    setCustomers(prev => prev.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
    setIsEditingCustomer(false);
    setSelectedCustomer(null);
  };

  // Handle deleting a customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      toast.success('Customer deleted successfully');
    }
  };

  // Handle editing a customer
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsEditingCustomer(true);
  };

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-primary" />
            Customer Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage your customer relationships and information
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingCustomer(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-4 mb-6 shadow-card border border-surface-200 dark:border-surface-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
              <option value="Former">Former</option>
            </select>
          </div>
          
          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="All">All Types</option>
              <option value="Corporate">Corporate</option>
              <option value="Small Business">Small Business</option>
              <option value="Individual">Individual</option>
              <option value="Government">Government</option>
              <option value="Non-profit">Non-profit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Customer Form */}
      <AnimatePresence>
        {isAddingCustomer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 mb-6 shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
            <CustomerForm 
              onSubmit={handleAddCustomer}
              onCancel={() => setIsAddingCustomer(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Customer Form */}
      <AnimatePresence>
        {isEditingCustomer && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 mb-6 shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
            <CustomerForm 
              customer={selectedCustomer}
              onSubmit={handleUpdateCustomer}
              onCancel={() => {
                setIsEditingCustomer(false);
                setSelectedCustomer(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customers List */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-semibold">Customers ({filteredCustomers.length})</h2>
        </div>

        {filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCustomers.map(customer => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-0 relative"
              >
                {/* Card Header & Actions */}
                <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {customer.type === 'Corporate' || customer.type === 'Small Business' ? (
                        <BuildingIcon className="w-4 h-4" />
                      ) : (
                        <UserRoundIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white line-clamp-1">
                        {customer.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditClick(customer)}
                      className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
                      aria-label="Edit customer"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400"
                      aria-label="Delete customer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <UserRoundIcon className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{customer.contactPerson || 'No contact person specified'}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MailIcon className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <PhoneIcon className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{customer.address || 'No address specified'}</span>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="px-4 py-3 bg-surface-50 dark:bg-surface-900/40 border-t border-surface-200 dark:border-surface-700 flex justify-between items-center text-xs text-surface-500 dark:text-surface-400">
                  <div className="flex items-center gap-1">
                    <ActivityIcon className="w-3.5 h-3.5" />
                    <span>{customer.status}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                    </span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div 
                  className={`absolute top-0 right-0 px-2 py-0.5 text-xs font-medium rounded-bl-md ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    customer.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    customer.status === 'Prospect' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300'
                  }`}
                >
                  {customer.type}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <InfoIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No customers found</h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' 
                ? "No customers match your current filters. Try adjusting your search criteria."
                : "You haven't added any customers yet. Click 'Add Customer' to get started."}
            </p>
            {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setTypeFilter('All');
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;