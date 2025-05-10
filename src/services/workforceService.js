import { format } from 'date-fns';

// Initialize localStorage with mock data if empty
const initializeEmployees = () => {
  const savedEmployees = localStorage.getItem('employees');
  
  if (!savedEmployees) {
    const initialEmployees = [
      {
        id: '1',
        name: 'John Smith',
        position: 'Production Manager',
        department: 'Production',
        email: 'john.smith@example.com',
        phone: '555-123-4567',
        hireDate: '2020-05-15',
        status: 'active',
        skills: ['Leadership', 'Process Optimization', 'Quality Control']
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        position: 'Quality Assurance Specialist',
        department: 'Quality Control',
        email: 'sarah.j@example.com',
        phone: '555-987-6543',
        hireDate: '2021-02-10',
        status: 'active',
        skills: ['Testing', 'Documentation', 'Regulatory Compliance']
      },
      {
        id: '3',
        name: 'Michael Chen',
        position: 'Machine Operator',
        department: 'Production',
        email: 'mchen@example.com',
        phone: '555-789-0123',
        hireDate: '2019-11-22',
        status: 'active',
        skills: ['CNC Operation', 'Maintenance', 'Safety Protocols']
      },
      {
        id: '4',
        name: 'Lisa Rodriguez',
        position: 'Inventory Specialist',
        department: 'Inventory',
        email: 'lrodriguez@example.com',
        phone: '555-456-7890',
        hireDate: '2022-01-05',
        status: 'active',
        skills: ['Inventory Management', 'Supply Chain', 'Data Entry']
      }
    ];
    localStorage.setItem('employees', JSON.stringify(initialEmployees));
    return initialEmployees;
  }
  
  return JSON.parse(savedEmployees);
};

// Get all employees
export const getEmployees = () => {
  return initializeEmployees();
};

// Get employee by ID
export const getEmployeeById = (id) => {
  const employees = getEmployees();
  return employees.find(employee => employee.id === id);
};

// Add new employee
export const addEmployee = (employee) => {
  const employees = getEmployees();
  const newEmployee = {
    ...employee,
    id: Date.now().toString(), // Generate a unique ID
    status: employee.status || 'active',
    skills: employee.skills || []
  };
  
  const updatedEmployees = [...employees, newEmployee];
  localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  return newEmployee;
};

// Update existing employee
export const updateEmployee = (updatedEmployee) => {
  const employees = getEmployees();
  const updatedEmployees = employees.map(employee => 
    employee.id === updatedEmployee.id ? updatedEmployee : employee
  );
  localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  return updatedEmployee;
};

// Delete employee by ID
export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const updatedEmployees = employees.filter(employee => employee.id !== id);
  localStorage.setItem('employees', JSON.stringify(updatedEmployees));
};