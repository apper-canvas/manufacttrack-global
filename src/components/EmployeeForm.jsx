import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'active',
    skills: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        skills: employee.skills || []
      });
    }
  }, [employee]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="John Smith"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="position" className="block text-sm font-medium mb-1">
            Position *
          </label>
          <input
            id="position"
            name="position"
            type="text"
            required
            value={formData.position}
            onChange={handleChange}
            className="input-field"
            placeholder="Production Manager"
          />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-1">
            Department *
          </label>
          <input
            id="department"
            name="department"
            type="text"
            required
            value={formData.department}
            onChange={handleChange}
            className="input-field"
            placeholder="Production"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            className="input-field"
            placeholder="555-123-4567"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hireDate" className="block text-sm font-medium mb-1">
            Hire Date
          </label>
          <input
            id="hireDate"
            name="hireDate"
            type="date"
            value={formData.hireDate || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'active'}
            onChange={handleChange}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="on leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Skills
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="input-field flex-1"
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn btn-outline"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-surface-200 dark:bg-surface-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-surface-500 hover:text-red-500 focus:outline-none ml-1"
              >
                ×
              </button>
            </motion.span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;