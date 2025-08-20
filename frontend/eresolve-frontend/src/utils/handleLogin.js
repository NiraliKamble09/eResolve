// import { login } from '../services/authService';
// import { fetchUserByEmail } from '../services/userDetailsService';
// import { jwtDecode } from 'jwt-decode';

// const normalizeRole = (role) => {
//   if (!role) return '';
//   const roleStr = Array.isArray(role) ? role[0] : role;
//   return roleStr.trim().toUpperCase(); // preserves "ROLE_" format
// };

// const roleToPath = {
//   ROLE_ADMIN: '/dashboard/admin',
//   ROLE_STAFF: '/dashboard/staff',
//   ROLE_USER: '/dashboard/user',
// };

// export const handleLogin = async (
//   { email, password },
//   expectedRole,
//   navigate,
//   setShowError,
//   setUser
// ) => {
//   try {
//     const res = await login({ email, password });
//     const { token, role: backendRole } = res.data;

//     const decoded = jwtDecode(token);

//     let actualRole = backendRole;
//     if (!actualRole) {
//       const authority = decoded.authorities?.[0];
//       actualRole = authority?.authority || authority || 'ROLE_USER';
//     }

//     const normalizedRole = normalizeRole(actualRole);
//     const normalizedExpected = normalizeRole(expectedRole);

//     if (normalizedRole !== normalizedExpected) {
//       setShowError(true);
//       return;
//     }

//     localStorage.setItem('token', token);
//     localStorage.setItem('role', normalizedRole);

//     const userEmail = decoded.email || decoded.sub;

//     if (['ROLE_ADMIN', 'ROLE_STAFF'].includes(normalizedRole)) {
//       try {
//         const userRes = await fetchUserByEmail(userEmail);
//         setUser(userRes.data);
//       } catch (fetchErr) {
//         console.warn('Failed to fetch user details:', fetchErr);
//         setUser({ email: userEmail, role: normalizedRole });
//       }
//     } else {
//       setUser({ email: userEmail, role: normalizedRole });
//     }

//     const redirectPath = roleToPath[normalizedRole];
//     if (redirectPath) {
//       navigate(redirectPath);
//     } else {
//       setShowError(true);
//     }

//   } catch (err) {
//     console.error('Login error:', err);
//     setShowError(true);
//   }
// };


import { login } from '../services/authService';

export const handleLogin = async ({ email, password }, expectedRole, navigate, setShowError) => {
  try {
    const res = await login({ email, password });
    const { token, role } = res.data;

    const normalizedRole = role?.trim().toLowerCase();
    const normalizedExpected = expectedRole?.trim().toLowerCase();

    if (normalizedRole !== normalizedExpected) {
      setShowError(true);
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('role', normalizedRole);

    switch (normalizedRole) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'staff':
        navigate('/dashboard/staff');
        break;
      case 'user':
        navigate('/dashboard/user');
        break;
      default:
        setShowError(true);
    }
  } catch (err) {
    setShowError(true);
  }
};