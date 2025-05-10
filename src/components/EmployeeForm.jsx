import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const EmployeeForm = ({ employee = null, onSubmit, onCancel }) => {
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
  const [errors, setErrors] = useState({});

  // Icons
  const UserIcon = getIcon('User');
  const BriefcaseIcon = getIcon('Briefcase');
  const BuildingIcon = getIcon('Building');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarIcon = getIcon('Calendar');
  const ActivityIcon = getIcon('Activity');
  const TagIcon = getIcon('Tag');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
      });
    }
  }, [employee]);

  const departments = [
    'Production',
    'Quality Control',
    'Inventory',
    'Maintenance',
    'Research & Development',
    'Administration',
    'Human Resources',
    'Logistics'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <UserIcon className="w-4 h-4" /> Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          placeholder="John Smith"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <BriefcaseIcon className="w-4 h-4" /> Position
        </label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className={`input-field ${errors.position ? 'border-red-500' : ''}`}
          placeholder="Production Manager"
        />
        {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <BuildingIcon className="w-4 h-4" /> Department
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`input-field ${errors.department ? 'border-red-500' : ''}`}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <MailIcon className="w-4 h-4" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john.smith@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <PhoneIcon className="w-4 h-4" /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="555-123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" /> Hire Date
        </label>
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          className={`input-field ${errors.hireDate ? 'border-red-500' : ''}`}
        />
        {errors.hireDate && <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <ActivityIcon className="w-4 h-4" /> Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field"
        >
          <option value="active">Active</option>
          <option value="on leave">On Leave</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <TagIcon className="w-4 h-4" /> Skills
        </label>
        <div className="flex mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="input-field rounded-r-none"
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-primary text-white px-3 py-2 rounded-r-lg hover:bg-primary-dark"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div key={index} className="bg-surface-200 dark:bg-surface-700 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-sm">{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-surface-500 hover:text-red-500"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn btn-primary"
        >
          <CheckIcon className="w-5 h-5 mr-1" />
          {employee ? 'Update Employee' : 'Add Employee'}
        </motion.button>
      </div>
    </form>
  );
};

export default EmployeeForm;