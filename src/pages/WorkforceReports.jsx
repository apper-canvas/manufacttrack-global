import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import getIcon from '../utils/iconUtils';
import * as workforceService from '../services/workforceService';

const WorkforceReports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [hiringTrendsData, setHiringTrendsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);

  // Icons
  const BarChart2Icon = getIcon('BarChart2');
  const UsersIcon = getIcon('Users');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PieChartIcon = getIcon('PieChart');
  const TrendingUpIcon = getIcon('TrendingUp');
  const BarChartIcon = getIcon('BarChart');
  const AwardIcon = getIcon('Award');
  const UserPlusIcon = getIcon('UserPlus');
  const UserMinusIcon = getIcon('UserMinus');
  const UserCheckIcon = getIcon('UserCheck');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay for demo purposes
        setTimeout(() => {
          // Get employees data for summary stats
          const employees = workforceService.getEmployees();
          setTotalEmployees(employees.length);
          setActiveEmployees(employees.filter(emp => emp.status === 'active').length);

          // Get department distribution
          const deptData = workforceService.getDepartmentDistribution();
          setDepartmentData(deptData);

          // Get status breakdown
          const statData = workforceService.getStatusBreakdown();
          setStatusData(statData);

          // Get hiring trends
          const hireData = workforceService.getHiringTrends();
          setHiringTrendsData(hireData);

          // Get skills analysis
          const skillsAnalysis = workforceService.getSkillsAnalysis();
          setSkillsData(skillsAnalysis);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Department distribution chart options
  const departmentChartOptions = {
    chart: {
      id: 'department-pie',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      toolbar: {
        show: false
      }
    },
    labels: departmentData.map(item => item.name),
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: {
        colors: '#64748b'
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} employees`
      }
    },
    colors: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 320
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Status breakdown chart options
  const statusChartOptions = {
    chart: {
      id: 'status-pie',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      toolbar: {
        show: false
      }
    },
    labels: statusData.map(item => item.name),
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: {
        colors: '#64748b'
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} employees`
      }
    },
    colors: ['#10b981', '#f97316', '#ef4444'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 320
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Hiring trends chart options
  const hiringTrendsChartOptions = {
    chart: {
      id: 'hiring-trends',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: hiringTrendsData.map(item => item.year.toString()),
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      title: {
        text: 'New Hires',
        style: {
          fontSize: '14px',
          color: '#64748b'
        }
      },
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} employees hired`
      }
    }
  };

  // Skills analysis chart options
  const skillsChartOptions = {
    chart: {
      id: 'skills-chart',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: skillsData.map(item => item.skill),
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    colors: ['#10b981'],
    tooltip: {
      y: {
        formatter: (value) => `${value} employees`
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2Icon className="w-6 h-6 text-primary" /> 
            Workforce Reports
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Analyze workforce metrics and trends
          </p>
        </div>
        <Link to="/workforce" className="btn btn-outline mt-4 md:mt-0 flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Workforce
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Total Employees</h3>
                <UsersIcon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{totalEmployees}</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Active Employees</h3>
                <UserCheckIcon className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-3xl font-bold">{activeEmployees}</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Inactive Employees</h3>
                <UserMinusIcon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-3xl font-bold">{totalEmployees - activeEmployees}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Department Distribution</h3>
              </div>
              {departmentData.length > 0 ? (
                <div className="flex justify-center">
                  <Chart 
                    options={departmentChartOptions} 
                    series={departmentData.map(item => item.value)} 
                    type="pie" 
                    height={350}
                  />
                </div>
              ) : (
                <p className="text-center text-surface-500 py-10">No department data available</p>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-semibold">Employee Status</h3>
              </div>
              {statusData.length > 0 ? (
                <div className="flex justify-center">
                  <Chart 
                    options={statusChartOptions} 
                    series={statusData.map(item => item.value)} 
                    type="donut" 
                    height={350}
                  />
                </div>
              ) : (
                <p className="text-center text-surface-500 py-10">No status data available</p>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUpIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Hiring Trends</h3>
              </div>
              {hiringTrendsData.length > 0 ? (
                <Chart 
                  options={hiringTrendsChartOptions} 
                  series={[{
                    name: 'New Hires',
                    data: hiringTrendsData.map(item => item.count)
                  }]} 
                  type="line" 
                  height={350}
                />
              ) : (
                <p className="text-center text-surface-500 py-10">No hiring trend data available</p>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <AwardIcon className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-semibold">Top Skills</h3>
              </div>
              {skillsData.length > 0 ? (
                <Chart 
                  options={skillsChartOptions} 
                  series={[{
                    name: 'Employees',
                    data: skillsData.map(item => item.count)
                  }]} 
                  type="bar" 
                  height={350}
                />
              ) : (
                <p className="text-center text-surface-500 py-10">No skills data available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkforceReports;