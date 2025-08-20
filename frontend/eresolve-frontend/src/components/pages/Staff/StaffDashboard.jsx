

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { fetchStaffDashboard } from "../../../services/staffService";
import { useTheme } from "../../contexts/ThemeContext"; // ✅ Theme context

const StaffDashboard = ({ loadDashboardData: externalLoadDashboardData }) => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalAssigned: 0,
    resolved: 0,
    inProgress: 0,
    open: 0,
  });

  const { isDark } = useTheme(); // ✅ Access theme

  useEffect(() => {
    if (externalLoadDashboardData) {
      externalLoadDashboardData.current = loadDashboardData;
    }
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchStaffDashboard();
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

  const pieChartData = [
    { name: "Open", value: dashboardStats.open, color: "#F59E0B" },
    { name: "In Progress", value: dashboardStats.inProgress, color: "#0A21C0" },
    { name: "Resolved", value: dashboardStats.resolved, color: "#10B981" },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Assigned"
          value={dashboardStats.totalAssigned}
          icon={<BarChart3 className="h-8 w-8 text-blue-500" />}
          isDark={isDark}
        />
        <StatCard
          label="In Progress"
          value={dashboardStats.inProgress}
          icon={<Clock className="h-8 w-8 text-blue-400" />}
          isDark={isDark}
        />
        <StatCard
          label="Resolved"
          value={dashboardStats.resolved}
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
          isDark={isDark}
        />
        <StatCard
          label="Open"
          value={dashboardStats.open}
          icon={<AlertCircle className="h-8 w-8 text-yellow-500" />}
          isDark={isDark}
        />
      </div>

      {dashboardStats.totalAssigned > 0 && (
        <div
          className={`rounded-lg p-6 border ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-100 border-blue-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Complaint Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                    border: `1px solid ${isDark ? "#374151" : "#9ebad7ff"}`,
                    borderRadius: "0.5rem",
                    color: isDark ? "#FFFFFF" : "#1F2937",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: isDark ? "#FFFFFF" : "#1F2937",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Reusable stat card with theme support
const StatCard = ({ label, value, icon, isDark }) => (
  <div
    className={`rounded-lg p-6 border ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-blue-100 border-blue-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
          {label}
        </p>
        <p className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-bold`}>
          {value}
        </p>
      </div>
      {icon}
    </div>
  </div>
);

export default StaffDashboard;