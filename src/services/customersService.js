// Import necessary utilities
import { toast } from 'react-toastify';

// LocalStorage key for customers data
const CUSTOMERS_STORAGE_KEY = 'manufacttrack_customers';

// Sample initial customers for first-time users
const initialCustomers = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactPerson: 'John Smith',
    email: 'john.smith@acmecorp.com',
    phone: '(555) 123-4567',
    address: '123 Business Ave, Industry City, 90210',
    type: 'Corporate',
    status: 'Active',
    notes: 'Major client for industrial equipment',
    createdAt: new Date('2023-01-15').toISOString()
  },
  {
    id: '2',
    name: 'TechSolutions Inc.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@techsolutions.com',
    phone: '(555) 987-6543',
    address: '456 Innovation Drive, Tech City, 90211',
    type: 'Corporate',
    status: 'Active',
    notes: 'Regular orders for custom electronics',
    createdAt: new Date('2023-03-20').toISOString()
  },
  {
    id: '3',
    name: 'Green Valley Farms',
    contactPerson: 'Michael Chen',
    email: 'michael@greenvalley.com',
    phone: '(555) 456-7890',
    address: '789 Rural Route, Farmington, 90212',
    type: 'Small Business',
    status: 'Inactive',
    notes: 'Seasonal client for agricultural equipment',
    createdAt: new Date('2023-05-10').toISOString()
  }
];

// Get all customers
export const getCustomers = () => {
  const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  return storedCustomers ? JSON.parse(storedCustomers) : initialCustomers;
};

// Add a new customer
export const addCustomer = (customer) => {
  const customers = getCustomers();
  const newCustomer = { ...customer, id: Date.now().toString(), createdAt: new Date().toISOString() };
  const updatedCustomers = [...customers, newCustomer];
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers));
  toast.success('Customer added successfully!');
  return newCustomer;
};

// Update an existing customer
export const updateCustomer = (updatedCustomer) => {
  const customers = getCustomers();
  const updatedCustomers = customers.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer);
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers));
  toast.success('Customer updated successfully!');
  return updatedCustomer;
};

// Delete a customer
export const deleteCustomer = (customerId) => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(customer => customer.id !== customerId);
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers));
  toast.success('Customer deleted successfully!');
};