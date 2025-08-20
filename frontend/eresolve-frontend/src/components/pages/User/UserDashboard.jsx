import React, { useState, useEffect } from 'react';
import {
  FileText, AlertCircle, CheckCircle, XCircle, Clock,
  ThumbsUp, PieChart
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { userService } from '../../../services/userService';

import {
  fetchUpvoteCount,
  submitUpvote
} from '../../../services/publicViewService'; // adjust path if needed

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const COLORS = {
    IN_PROGRESS: "#050A44",
    RESOLVED: "#0A21C0",
    OPEN: "#2C2E3A",
  };

  const fetchDashboard = async () => {
  setLoading(true);
  try {
    const res = await userService.fetchUserDashboard();
    const dashboard = res.data;

    // Fetch upvote counts for each complaint
    const upvotePromises = dashboard.recentComplaints.map((c) =>
      fetchUpvoteCount(c.complaintId)
    );
    const upvoteResults = await Promise.all(upvotePromises);

    // Inject real upvote counts into each complaint
    dashboard.recentComplaints = dashboard.recentComplaints.map((c, i) => ({
      ...c,
      upvoteCount: upvoteResults[i].data.upvotes,
    }));

    setDashboardData(dashboard);
  } catch (error) {
    console.error("Error loading dashboard:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

const handleUpvote = async (complaintId) => {
  try {
    await submitUpvote(complaintId); // triggers backend update

    const res = await fetchUpvoteCount(complaintId); // fetches from public_view
    const newCount = res.data.upvotes; // ✅ make sure this matches your backend response

    setDashboardData((prev) => {
      const updated = { ...prev };
      updated.recentComplaints = updated.recentComplaints.map((c) =>
        c.complaintId === complaintId
          ? {
              ...c,
              upvoteCount: newCount,
              userHasUpvoted: true,
            }
          : c
      );
      return updated;
    });
  } catch (error) {
    console.error("Error upvoting complaint:", error);
  }
};
  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-slate-800 text-blue-100 border-slate-700";
      case "RESOLVED":
        return "bg-blue-800 text-blue-100 border-blue-700";
      case "OPEN":
        return "bg-slate-600 text-slate-100 border-slate-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return <AlertCircle className="w-4 h-4 text-blue-100" />;
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-blue-300" />;
      case "OPEN":
        return <XCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPieChartData = () => {
    return [
      { name: "Open", value: dashboardData.openCount, color: COLORS.OPEN },
      { name: "In Progress", value: dashboardData.inProgressCount, color: COLORS.IN_PROGRESS },
      { name: "Resolved", value: dashboardData.resolvedCount, color: COLORS.RESOLVED },
    ].filter((item) => item.value > 0);
  };

  if (loading || !dashboardData) {
    return <div className="p-6 text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Dashboard Overview
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Complaints</p>
                <p className="text-2xl font-bold text-slate-800">{dashboardData.totalComplaints}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
          </div>

          <div className={`${getStatusColor("OPEN")} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Open</p>
                <p className="text-2xl font-bold text-white">{dashboardData.openCount}</p>
              </div>
              {getStatusIcon("OPEN")}
            </div>
          </div>

          <div className={`${getStatusColor("IN_PROGRESS")} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-white">{dashboardData.inProgressCount}</p>
              </div>
              {getStatusIcon("IN_PROGRESS")}
            </div>
          </div>

          <div className={`${getStatusColor("RESOLVED")} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-white">{dashboardData.resolvedCount}</p>
              </div>
              {getStatusIcon("RESOLVED")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Complaints Status Chart */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 text-slate-600 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">
                Complaints by Status
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-slate-600">{value}</span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Complaints */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Complaints
            </h3>
            <div className="space-y-3">
              {dashboardData.recentComplaints?.slice(0, 3).map((complaint) => (
                <div
                  key={complaint.complaintId}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{complaint.title}</h4>
                      <p className="text-sm text-slate-600">{complaint.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpvote(complaint.complaintId)}
                        disabled={complaint.userHasUpvoted}
                        className={`flex items-center space-x-1 transition-colors p-1 rounded ${
                          complaint.userHasUpvoted
                            ? "text-blue-400 bg-blue-50 cursor-not-allowed"
                            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {complaint.upvoteCount}
                        </span>
                      </button>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(complaint.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}
                        >
                                                   {complaint.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {dashboardData.recentComplaints?.length === 0 && (
                <p className="text-slate-500">No complaints submitted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;