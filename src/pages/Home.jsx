import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Icon components
  const LayoutDashboardIcon = getIcon('LayoutDashboard');
  const BoxIcon = getIcon('Package');
  const ClipboardListIcon = getIcon('ClipboardList');
  const UsersIcon = getIcon('Users');
  const UserIcon = getIcon('User');
  const BarChart2Icon = getIcon('BarChart2');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboardIcon },
    { id: 'inventory', name: 'Inventory', icon: BoxIcon },
    { id: 'production', name: 'Production', icon: ClipboardListIcon },
    { id: 'workforce', name: 'Workforce', icon: UsersIcon },
    { id: 'customers', name: 'Customers', icon: UserIcon },
    { id: 'reports', name: 'Reports', icon: BarChart2Icon },
  ];

  const FactoryIcon = getIcon('Factory');
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
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

  // Handle tab navigation
  const handleTabNavigation = (item) => {
    if (item.id === 'inventory') {
      navigate('/inventory');
    } else if (item.id === 'production') {
      navigate('/production');
    } else if (item.id === 'workforce') {
      navigate('/workforce');
    } else {
      handleTabChange(item.id);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-116px)]">
      {/* Sidebar navigation - hidden on mobile, visible on md screens */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 p-4">
        <div className="space-y-2 sticky top-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabNavigation(item)}
                className={`
                  w-full flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${activeTab === item.id 
                    ? 'bg-primary text-white font-medium' 
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile navigation - visible on mobile, hidden on md screens */}
      <div className="md:hidden overflow-x-auto scrollbar-hide bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <div className="flex px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              item.id === 'inventory' ? (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  className={`flex flex-col items-center gap-1 px-4 py-3 transition-colors ${
                    activeTab === item.id
                      ? 'text-primary border-b-2 border-primary font-medium'
                      : 'text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              ) : (
                item.id === 'production' ? (
                  <Link
                    key={item.id}
                    to="/production"
                    className={`flex flex-col items-center gap-1 px-4 py-3 transition-colors ${
                      activeTab === item.id
                        ? 'text-primary border-b-2 border-primary font-medium'
                        : 'text-surface-600 dark:text-surface-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.name}</span>
                  </Link>
                item.id === 'workforce' ? (
                  <Link
                    key={item.id}
                    to="/workforce"
                    className={`flex flex-col items-center gap-1 px-4 py-3 transition-colors ${
                      activeTab === item.id
                        ? 'text-primary border-b-2 border-primary font-medium'
                        : 'text-surface-600 dark:text-surface-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.name}</span>
                  </Link>
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 transition-colors ${
                    activeTab === item.id
                      ? 'text-primary border-b-2 border-primary font-medium'
                      : 'text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </button>
              )
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-surface-50 dark:bg-surface-900">
        {activeTab === 'dashboard' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                Welcome to ManufacTrack
              </h1>
              <p className="mt-2 text-surface-600 dark:text-surface-300">
                Manage your manufacturing operations efficiently
              </p>
            </motion.div>

            {/* Stats overview */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Inventory Items', value: '248', color: 'bg-blue-500' },
                { label: 'Active Orders', value: '42', color: 'bg-green-500' },
                { label: 'In Production', value: '18', color: 'bg-yellow-500' },
                { label: 'Employees', value: '24', color: 'bg-purple-500' },
              ].map((stat, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                      <span className="text-xl font-bold">{stat.value.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-surface-500 dark:text-surface-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Main feature */}
            <motion.div variants={itemVariants}>
              <MainFeature />
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Inventory Management</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              This section is under development. Switch to Dashboard to see the main interactive feature.
            </p>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Production Planning</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              This section is under development. Switch to Dashboard to see the main interactive feature.
            </p>
          </div>
        )}

        {activeTab === 'workforce' && (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Workforce Management</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              This section is under development. Switch to Dashboard to see the main interactive feature.
            </p>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Customer Management</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              This section is under development. Switch to Dashboard to see the main interactive feature.
            </p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              This section is under development. Switch to Dashboard to see the main interactive feature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;