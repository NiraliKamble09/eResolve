

import React from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import About from "../sections/About";
import Features from "../sections/Features";
import ActionCards from "../sections/ActionCards";
import Register from "../pages/Login/Register";
import UserLogin from "../pages/Login/UserLogin";
import AdminLogin from "../pages/Login/AdminLogin";
import StaffLogin from "../pages/Login/StaffLogin";
import UserComplaintPortal from "../pages/User/UserComplaintPortal";
import StaffComplaintPortal from "../pages/Staff/StaffComplaintPortal";
import AdminComplaintPortal from "../pages/Admin/AdminComplaintPortal";
import FAQPage from "../sections/FAQPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <>
          <Hero />
          <Marquee />
          <About />
          <Features />
          <ActionCards />
        </>
      }
    />
    <Route path="/register" element={<Register />} />
    <Route path="/login/user" element={<UserLogin />} />
    <Route path="/login/admin" element={<AdminLogin />} />
    <Route path="/login/staff" element={<StaffLogin />} />
    <Route path="/faq" element={<FAQPage />} />

    <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
      <Route path="/dashboard/admin" element={<AdminComplaintPortal />} />
    </Route>

    <Route element={<ProtectedRoute allowedRole="STAFF" />}>
      <Route path="/dashboard/staff" element={<StaffComplaintPortal />} />
    </Route>

    <Route element={<ProtectedRoute allowedRole="USER" />}>
      <Route path="/dashboard/user" element={<UserComplaintPortal />} />
    </Route>
  </Routes>
);

export default AppRoutes;