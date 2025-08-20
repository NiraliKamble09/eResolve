
import React, { useState, useEffect } from "react";
import {
  Pie,
  PieChart as RePieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Clock,
  Activity,
  CheckCircle,
  PieChart,
} from "lucide-react";
import StatCard from "./StatCard";
import { fetchDashboardStats } from "../../../services/adminService"; // ✅ Import real API

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    openComplaints: 0,
    inProgress: 0,
    resolved: 0,
    recentActivity: [],
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetchDashboardStats();
        setStats({
          totalComplaints: response.data.totalComplaints || 0,
          openComplaints: response.data.openComplaints || 0,
          inProgress: response.data.inProgress || 0,
          resolved: response.data.resolved || 0,
          recentActivity: response.data.recentActivity || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          totalComplaints: 0,
          openComplaints: 0,
          inProgress: 0,
          resolved: 0,
          recentActivity: [],
        });
      }
    }
    loadStats();
  }, []);

  const pieData = [
    { name: "Total", value: stats.totalComplaints, color: "#374151" },
    { name: "Open", value: stats.openComplaints, color: "#050A44" },
    { name: "In Progress", value: stats.inProgress, color: "#050A44" },
    { name: "Resolved", value: stats.resolved, color: "#0A21C0" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={FileText} title="Total Complaints" value={stats.totalComplaints} color="bg-blue-500" />
        <StatCard icon={Clock} title="Open" value={stats.openComplaints} color="bg-yellow-500" />
        <StatCard icon={Activity} title="In Progress" value={stats.inProgress} color="bg-indigo-500" />
        <StatCard icon={CheckCircle} title="Resolved" value={stats.resolved} color="bg-green-500" />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Complaints Overview
          </h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    wrapperStyle={{
                      width: 70,
                      fontSize: 13,
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #d5d5d5",
                      borderRadius: 3,
                      lineHeight: "0px",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No complaints data available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;