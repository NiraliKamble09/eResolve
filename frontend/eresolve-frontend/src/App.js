import React from 'react';
import { ThemeProvider } from './components/contexts/ThemeContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppRoutes from './components/routes/AppRoutes';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n';

const AppLayout = () => {
  const location = useLocation();
  console.log('Current Path:', location.pathname);
  
  // Define routes where header and footer should be shown
  const showHeaderFooterRoutes = [
    '/',           // Landing page
    '/home',       // Home page
    '/features',   // Features page
    '/about',      // About page
    '/contact',    // Contact page
  ];
  
  // Check if current route should show header and footer
  const shouldShowHeaderFooter = showHeaderFooterRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen">
      {shouldShowHeaderFooter && <Header />}
      <main>
        <AppRoutes />
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;