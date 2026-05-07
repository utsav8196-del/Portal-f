import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

// TypeScript interfaces
interface Stats {
  totalProjects: number;
  totalWorkers: number;
  averageProgress: number;
  completedProjects?: number;
}

interface Project {
  _id: string;
  name: string;
  progress: number;
  createdAt?: string;
  description?: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalWorkers: 0,
    averageProgress: 0,
    completedProjects: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          axios.get('/api/stats', { withCredentials: true }),
          axios.get('/api/projects', { withCredentials: true }),
        ]);

        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        setProjects(projectsData);

        const completedCount = projectsData.filter((p: Project) => p.progress === 100).length;
        setStats({
          ...statsRes.data,
          completedProjects: completedCount,
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to load dashboard. Please refresh the page or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data (only projects with at least 1% progress, or all)
  const chartData = projects
    .map((p) => ({ name: p.name, progress: p.progress }))
    .sort((a, b) => b.progress - a.progress); // sort descending for better visual

  // Get 5 most recent projects (by createdAt, fallback to order as is)
  const recentProjects = [...projects]
    .sort((a, b) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0))
    .slice(0, 5);

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Progress: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalProjects}</p>
          <p className="text-xs text-gray-400 mt-1">All projects</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Workers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalWorkers}</p>
          <p className="text-xs text-gray-400 mt-1">Labour count</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Average Progress</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.averageProgress}%</p>
          <p className="text-xs text-gray-400 mt-1">Completion rate</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Completed Projects</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.completedProjects}</p>
          <p className="text-xs text-gray-400 mt-1">100% done</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Project Progress Overview</h2>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects yet.</p>
            <Link to="/projects" className="text-blue-600 hover:underline mt-2 inline-block">
              Create your first project →
            </Link>
          </div>
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="progress" fill="url(#gradient)" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.progress === 100 ? '#10b981' : '#3b82f6'}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No projects to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Project Name</th>
                  <th className="text-left py-3">Progress</th>
                  <th className="text-left py-3">Status</th>
                 </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{project.name}</td>
                    <td className="py-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {project.progress === 100 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Completed
                        </span>
                      ) : project.progress > 0 ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          Not Started
                        </span>
                      )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}