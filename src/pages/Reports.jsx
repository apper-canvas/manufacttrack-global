import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import ReportCard from '../components/ReportCard';
import { 
  getInventoryAnalytics, 
  getProductionAnalytics, 
  getWorkforceAnalytics, 
  getCustomerAnalytics 
} from '../services/reportsService';

function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    inventory: null,
    production: null,
    workforce: null,
    customers: null
  });

  // Icons
  const BarChart2Icon = getIcon('BarChart2');
  const BoxIcon = getIcon('Package');
  const ClipboardListIcon = getIcon('ClipboardList');
  const UsersIcon = getIcon('Users');
  const UserIcon = getIcon('User');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      try {
        const inventory = getInventoryAnalytics();
        const production = getProductionAnalytics();
        const workforce = getWorkforceAnalytics();
        const customers = getCustomerAnalytics();
        
        setReportData({
          inventory,
          production,
          workforce,
          customers
        });
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load report data');
        console.error(error);
        setLoading(false);
      }
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart2Icon },
    { id: 'inventory', name: 'Inventory', icon: BoxIcon },
    { id: 'production', name: 'Production', icon: ClipboardListIcon },
    { id: 'workforce', name: 'Workforce', icon: UsersIcon },
    { id: 'customers', name: 'Customers', icon: UserIcon },
  ];

  // Default chart options
  const defaultChartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    tooltip: {
      theme: 'dark'
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
    },
    legend: {
      position: 'top'
    }
  };

  // Render different report sections based on active tab
  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'inventory':
        return renderInventoryReports();
      case 'production':
        return renderProductionReports();
      case 'workforce':
        return renderWorkforceReports();
      case 'customers':
        return renderCustomerReports();
      default:
        return renderOverview();
    }
  };

  // Overview tab content
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard>
            <div className="flex flex-col items-center text-center">
              <BoxIcon className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="text-lg font-medium">Inventory Status</h4>
              <div className="mt-2 text-3xl font-bold">248</div>
              <div className="text-sm text-surface-500">Items in stock</div>
            </div>
          </ReportCard>
          
          <ReportCard>
            <div className="flex flex-col items-center text-center">
              <ClipboardListIcon className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="text-lg font-medium">Production</h4>
              <div className="mt-2 text-3xl font-bold">87%</div>
              <div className="text-sm text-surface-500">Efficiency rate</div>
            </div>
          </ReportCard>
          
          <ReportCard>
            <div className="flex flex-col items-center text-center">
              <UsersIcon className="w-8 h-8 text-purple-500 mb-2" />
              <h4 className="text-lg font-medium">Workforce</h4>
              <div className="mt-2 text-3xl font-bold">92%</div>
              <div className="text-sm text-surface-500">Attendance rate</div>
            </div>
          </ReportCard>
          
          <ReportCard>
            <div className="flex flex-col items-center text-center">
              <UserIcon className="w-8 h-8 text-red-500 mb-2" />
              <h4 className="text-lg font-medium">Customers</h4>
              <div className="mt-2 text-3xl font-bold">87%</div>
              <div className="text-sm text-surface-500">Satisfaction score</div>
            </div>
          </ReportCard>
        </div>
        
        <ReportCard title="Monthly Production Overview">
          <div className="h-72">
            <Chart
              options={{
                ...defaultChartOptions,
                xaxis: {
                  categories: reportData.production.output.categories,
                },
                yaxis: {
                  title: {
                    text: 'Units'
                  }
                }
              }}
              series={[{ name: 'Units Produced', data: reportData.production.output.series[0].data }]}
              type="line"
              height="100%"
            />
          </div>
        </ReportCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard title="Inventory Distribution">
            <div className="h-64">
              <Chart
                options={{
                  ...defaultChartOptions,
                  labels: reportData.inventory.currentStock.categories,
                  dataLabels: {
                    enabled: false
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '60%'
                      }
                    }
                  }
                }}
                series={reportData.inventory.currentStock.series[0].data}
                type="donut"
                height="100%"
              />
            </div>
          </ReportCard>
          
          <ReportCard title="Department Distribution">
            <div className="h-64">
              <Chart
                options={{
                  ...defaultChartOptions,
                  labels: reportData.workforce.departments.labels,
                  dataLabels: {
                    enabled: false
                  }
                }}
                series={reportData.workforce.departments.series}
                type="pie"
                height="100%"
              />
            </div>
          </ReportCard>
        </div>
      </div>
    );
  };

  // Tab-specific reports
  const renderInventoryReports = () => {
    return (
      <div className="space-y-6">
        <ReportCard title="Inventory Level by Category">
          <div className="h-72">
            <Chart
              options={{
                ...defaultChartOptions,
                xaxis: {
                  categories: reportData.inventory.currentStock.categories,
                },
                yaxis: {
                  title: {
                    text: 'Quantity'
                  }
                }
              }}
              series={reportData.inventory.currentStock.series}
              type="bar"
              height="100%"
            />
          </div>
        </ReportCard>
      </div>
    );
  };

  const renderProductionReports = () => {
    return (
      <div className="space-y-6">
        <ReportCard title="Production Output (Last 14 Days)">
          <div className="h-72">
            <Chart
              options={{
                ...defaultChartOptions,
                xaxis: {
                  categories: reportData.production.output.categories,
                }
              }}
              series={reportData.production.output.series}
              type="area"
              height="100%"
            />
          </div>
        </ReportCard>
      </div>
    );
  };

  const renderWorkforceReports = () => {
    return <div className="text-center py-8">Workforce reports coming soon</div>;
  };

  const renderCustomerReports = () => {
    return <div className="text-center py-8">Customer reports coming soon</div>;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      
      {/* Tabs navigation */}
      <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-primary text-white' : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
      
      {/* Report content based on active tab */}
      {renderReportContent()}
    </div>
  );
}

export default Reports;