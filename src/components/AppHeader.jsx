import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const AppHeader = ({ title, subtitle, showBackButton = false, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserEmail = () => {
    try {
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        return session.email;
      }
    } catch (error) {
      console.error('Erro ao obter email do usuário:', error);
    }
    return 'usuario@exemplo.com';
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/login');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/client-management', label: 'Clientes', icon: 'Users' },
    { path: '/service-visit-workflow', label: 'Nova Visita', icon: 'UserPlus' },
    { path: '/product-inventory', label: 'Estoque', icon: 'Package' },
    { path: '/client-service-history', label: 'Histórico', icon: 'FileText' },
    { path: '/ai-assistant', label: 'IA Assistant', icon: 'Brain' }
  ];

  const currentPath = location.pathname;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                Voltar
              </Button>
            )}
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Icon name="Waves" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {title || 'Meu Piscineiro'}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "default" : "ghost"}
                size="sm"
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate(item.path)}
                className="relative"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right side - User Menu and Actions */}
          <div className="flex items-center space-x-4">
            {/* Children (custom buttons) */}
            {children && (
              <div className="flex items-center space-x-2">
                {children}
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {getUserEmail().split('@')[0]}
                </span>
                <Icon name="ChevronDown" size={16} />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Logado como:</p>
                    <p className="text-sm text-gray-600 truncate">{getUserEmail()}</p>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <div className="lg:hidden border-b border-gray-100 py-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                          currentPath === item.path
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon name={item.icon} size={16} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Icon name="LogOut" size={16} />
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AppHeader;