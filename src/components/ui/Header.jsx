import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Clientes', path: '/client-management', icon: 'Users' },
    { label: 'Produtos', path: '/product-inventory', icon: 'Package' },
    { label: 'Visitas', path: '/service-visit-workflow', icon: 'Calendar' }
  ];

  const handleNavigation = (path) => {
    router?.push(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    if (path === '/client-management') {
      return router?.pathname === '/client-management' || router?.pathname === '/client-service-history';
    }
    return router?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-surface border-b border-border shadow-elevation-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
              onClick={() => handleNavigation('/dashboard')}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Icon name="Waves" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">
                Meu Piscineiro
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="px-3 py-2"
              >
                {item?.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={20}
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-4 py-2 space-y-1">
              {navigationItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  className="justify-start px-3 py-2"
                >
                  {item?.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;