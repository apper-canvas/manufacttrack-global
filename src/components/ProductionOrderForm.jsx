import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function ProductionOrderForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    productName: '',
    workOrder: '',
    customer: '',
    quantity: '',
    unit: 'pcs',
    startDate: '',
    endDate: '',
    status: 'scheduled',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      // Format dates for date inputs
      const formattedData = {
        ...initialData,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : ''
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  // Icon components
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.workOrder.trim()) {
      newErrors.workOrder = 'Work order number is required';
    }
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer name is required';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? (value === '' ? '' : parseInt(value, 10) || '') : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format dates for ISO strings
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };
      
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium mb-1">
            Product Name*
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={`input-field ${errors.productName ? 'border-red-500' : ''}`}
            placeholder="Enter product name"
          />
          {errors.productName && (
            <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="workOrder" className="block text-sm font-medium mb-1">
            Work Order Number*
          </label>
          <input
            type="text"
            id="workOrder"
            name="workOrder"
            value={formData.workOrder}
            onChange={handleChange}
            className={`input-field ${errors.workOrder ? 'border-red-500' : ''}`}
            placeholder="Enter work order number"
          />
          {errors.workOrder && (
            <p className="text-red-500 text-xs mt-1">{errors.workOrder}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium mb-1">
            Customer*
          </label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className={`input-field ${errors.customer ? 'border-red-500' : ''}`}
            placeholder="Enter customer name"
          />
          {errors.customer && (
            <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
          )}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          <div className="col-span-4">
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity*
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
              placeholder="Quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          
          <div className="col-span-3">
            <label htmlFor="unit" className="block text-sm font-medium mb-1">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="input-field"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="lbs">Pounds</option>
              <option value="liters">Liters</option>
              <option value="boxes">Boxes</option>
              <option value="batches">Batches</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date*
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            Expected End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input-field"
            min={formData.startDate}
          />
        </div>
      </div>
      
      {initialData && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Enter any special instructions or notes"
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline flex items-center gap-2"
          onClick={onCancel}
        >
          <XIcon className="w-4 h-4" />
          Cancel
        </motion.button>
        
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
        >
          <SaveIcon className="w-4 h-4" />
          {initialData ? 'Update Order' : 'Create Order'}
        </motion.button>
      </div>
    </form>
  );
}

export default ProductionOrderForm;