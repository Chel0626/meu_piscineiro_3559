import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import ServiceVisitWorkflow from './pages/service-visit-workflow';
import ProductInventory from './pages/product-inventory';
import ClientManagement from './pages/client-management';
import ClientServiceHistory from './pages/client-service-history';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ClientManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service-visit-workflow" element={<ServiceVisitWorkflow />} />
        <Route path="/product-inventory" element={<ProductInventory />} />
        <Route path="/client-management" element={<ClientManagement />} />
        <Route path="/client-service-history" element={<ClientServiceHistory />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
