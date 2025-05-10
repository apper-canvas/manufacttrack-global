import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
const UsersIcon = getIcon('Users');
import * as workforceService from '../services/workforceService';

const Workforce = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
const BarChart2Icon = getIcon('BarChart2');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

  // Icons
  const UserPlusIcon = getIcon('UserPlus');
  const SearchIcon = getIcon('Search');
  const UsersIcon = getIcon('Users');
  const FilterIcon = getIcon('Filter');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const ChevronDownIcon = getIcon('ChevronDown');
  const ChevronUpIcon = getIcon('ChevronUp');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const BarChartIcon = getIcon('BarChart');

  useEffect(() => {
    // Fetch employees data
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        // Using setTimeout to simulate API call for demo purposes
        setTimeout(() => {
          const data = workforceService.getEmployees();
          setEmployees(data);
          setFilteredEmployees(data);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setIsLoading(false);
        toast.error('Failed to load employee data');
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...employees];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        employee => 
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply department filter
    if (filterDepartment !== 'all') {
      result = result.filter(employee => employee.department === filterDepartment);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(employee => employee.status === filterStatus);
    }
    
    setFilteredEmployees(result);
  }, [employees, searchTerm, filterDepartment, filterStatus]);

  const handleAddEmployee = (employeeData) => {
    try {
      const newEmployee = workforceService.addEmployee(employeeData);
      setEmployees([...employees, newEmployee]);
      setShowAddForm(false);
      toast.success('Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleUpdateEmployee = (employeeData) => {
    try {
      const updatedEmployee = workforceService.updateEmployee(employeeData);
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      setEditingEmployee(null);
      toast.success('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      <>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <UsersIcon className="w-6 h-6 text-primary" /> 
            Workforce
          </h1>
          <h1 className="text-base text-surface-600 dark:text-surface-400">
            Manage employees and teams
            <span className="text-sm ml-1">
              ({employees.length} total)
            </span>
          </>

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        workforceService.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        toast.success('Employee removed successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
          
          <Link 
            to="/workforce/reports" 
            className="btn btn-outline flex items-center justify-center"
          >
            <BarChart2Icon className="w-5 h-5 mr-1" /> View Reports
          </Link>
  };

  const handleExpandEmployee = (id) => {
    setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
  };

  // Get unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-primary" /> 
            Workforce Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Link 
            to="/workforce/reports" 
            className="btn btn-outline flex items-center justify-center gap-2"
          >
            <BarChartIcon className="w-5 h-5" />
            <span>View Reports</span>
          </Link>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAddForm(true);
              setEditingEmployee(null);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            Add New Employee
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-4 mb-6 border border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees by name, position or email"
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="input-field pr-10 appearance-none"
              >
                <option value="all">All Departments</option>
                {departments.filter(d => d !== 'all').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pr-10 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
              <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
                <p className="text-surface-600 dark:text-surface-400">No employees found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map(employee => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
                  >
                    <div 
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                      onClick={() => handleExpandEmployee(employee.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white
                          ${employee.status === 'active' ? 'bg-green-500' : 
                            employee.status === 'on leave' ? 'bg-yellow-500' : 'bg-red-500'}
                        `}>
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{employee.name}</h3>
                          <p className="text-sm text-surface-600 dark:text-surface-400">{employee.position} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 md:mt-0">
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            employee.status === 'on leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}
                        `}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEmployee(employee);
                          }}
                          className="p-2 text-surface-500 hover:text-primary"
                          aria-label="Edit employee"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEmployee(employee.id);
                          }}
                          className="p-2 text-surface-500 hover:text-red-500"
                          aria-label="Delete employee"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        {expandedEmployeeId === employee.id ? (
                          <ChevronUpIcon className="w-5 h-5 text-surface-400" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-surface-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedEmployeeId === employee.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-surface-200 dark:border-surface-700 px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-surface-500" />
                            <span className="text-sm">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-surface-500" />
                            <span className="text-sm">{employee.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-surface-500" />
                            <span className="text-sm">Hired: {
                              employee.hireDate ? format(new Date(employee.hireDate), 'MMM d, yyyy') : 'Not provided'
                            }</span>
                          </div>
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <TagIcon className="w-4 h-4 text-surface-500" />
                              <span className="text-sm font-medium">Skills:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {employee.skills && employee.skills.length > 0 ? (
                                employee.skills.map((skill, index) => (
                                  <span key={index} className="text-xs bg-surface-200 dark:bg-surface-700 px-2 py-1 rounded-full">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-surface-500">No skills listed</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserPlusIcon className="w-5 h-5 text-primary" />
                Add New Employee
              </h2>
              <EmployeeForm 
                onSubmit={handleAddEmployee}
                onCancel={() => setShowAddForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {editingEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <EditIcon className="w-5 h-5 text-primary" />
                Edit Employee
              </h2>
              <EmployeeForm 
                employee={editingEmployee}
                onSubmit={handleUpdateEmployee}
                onCancel={() => setEditingEmployee(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workforce;