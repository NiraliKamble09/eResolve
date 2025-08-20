import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/authService'; // adjust path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const credentials = { email, password };
      const res = await login(credentials);

      const { token, role } = res.data;

      // Save token and role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      alert('Login successful!');

      // Redirect based on role
      if (role === 'USER') {
        navigate('/user/dashboard');
      } else if (role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        alert('Unknown role. Cannot redirect.');
      }
    } catch (err) {
      alert(err?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4">Login to eResolve</h3>

      <div className="mb-3">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin} className="btn btn-primary w-100">
        Login
      </button>

      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;