import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import ServiceVisitWorkflow from './pages/service-visit-workflow';
import ProductInventory from './pages/product-inventory';
import ClientManagement from './pages/client-management';
import ClientServiceHistory from './pages/client-service-history';
import AIAssistant from './pages/ai-assistant';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) return false;
    
    try {
      const session = JSON.parse(userSession);
      // Verifica se a sessão existe e tem email
      return session && session.email;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Componente para redirecionar usuários já logados da página de login
const PublicRoute = ({ children }) => {
  const isAuthenticated = () => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) return false;
    
    try {
      const session = JSON.parse(userSession);
      return session && session.email;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Rota raiz - redireciona para login se não autenticado, dashboard se autenticado */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota pública - apenas para usuários não autenticados */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Rotas protegidas - apenas para usuários autenticados */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/service-visit-workflow" 
            element={
              <ProtectedRoute>
                <ServiceVisitWorkflow />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/product-inventory" 
            element={
              <ProtectedRoute>
                <ProductInventory />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/client-management" 
            element={
              <ProtectedRoute>
                <ClientManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/client-service-history" 
            element={
              <ProtectedRoute>
                <ClientServiceHistory />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/ai-assistant" 
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;