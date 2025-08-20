// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const normalizeRole = (role) => {
//   if (!role) return '';
//   const roleStr = Array.isArray(role) ? role[0] : role;
//   return roleStr.trim().toUpperCase(); // preserves "ROLE_" format
// };

// const ProtectedRoute = ({ allowedRole }) => {
//   const token = localStorage.getItem('token');

//   if (!token) {
//     return <Navigate to="/login/user" replace />;
//   }

//   try {
//     const decoded = jwtDecode(token);

//     const rawRole =
//       decoded.role ||
//       decoded.authorities?.[0]?.authority ||
//       decoded.authorities?.[0] ||
//       'ROLE_USER';

//     const normalizedRole = normalizeRole(rawRole);
//     const normalizedAllowed = normalizeRole(allowedRole);

//     if (normalizedRole !== normalizedAllowed) {
//       return <Navigate to={`/login/${normalizedRole.toLowerCase().replace('ROLE_', '')}`} replace />;
//     }

//     return <Outlet />;
//   } catch (err) {
//     console.error('Token decoding failed:', err);
//     return <Navigate to="/login/user" replace />;
//   }
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login/user" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const rawRole = decoded.role || decoded.authorities?.[0] || 'ROLE_USER';

    // Normalize role: remove "ROLE_" prefix and convert to lowercase
    const normalizedRole = rawRole.toLowerCase().replace('role_', '');
    const normalizedAllowed = allowedRole.toLowerCase();

    if (normalizedRole !== normalizedAllowed) {
      return <Navigate to={`/login/${normalizedRole}`} replace />;
    }

    return <Outlet />;
  } catch (err) {
    console.error('Token decoding failed:', err);
    return <Navigate to="/login/user" replace />;
  }
};

export default ProtectedRoute;


