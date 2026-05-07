import {
  ClipboardList,
  CreditCard,
  CirclePlus,
  RefreshCw,
  Users,
} from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import { statsData, recentActivities, performanceData } from "../data/mockData";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();

      const keysToShow = ["users", "countries", "jobs", "news"];

      const filteredStats = keysToShow.map((key, index) => ({
        id: index,
        title: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: data[key] ?? 0,
      }));

      setStatsData(filteredStats);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {/* <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CirclePlus size={16} className="mr-2" />
            New Report
          </button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          statsData.map((stat) => (
            <StatsCard key={stat.id} title={stat.title} value={stat.value} />
          ))
        )}
      </div>

      {/* Quick Action Cards */}
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="rounded-full bg-blue-50 p-3">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-500">Add, edit or remove users</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="rounded-full bg-green-50 p-3">
            <CreditCard size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Manage Billing
            </h3>
            <p className="text-sm text-gray-500">View invoices and plans</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="rounded-full bg-purple-50 p-3">
            <ClipboardList size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">View Reports</h3>
            <p className="text-sm text-gray-500">Access all reports</p>
          </div>
        </div>
      </div> */}

      {/* Charts and Tables */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceChart data={performanceData} title="Performance Overview" />
        <RecentActivityTable activities={recentActivities} />
      </div> */}
    </div>
  );
};

export default Dashboard;
