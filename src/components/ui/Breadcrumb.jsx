import React from 'react';
import { useRouter } from 'next/router';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ items = [] }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    if (path) {
      router?.push(path);
    }
  };

  // Auto-generate breadcrumbs based on current route if no items provided
  const getBreadcrumbItems = () => {
    if (items?.length > 0) return items;

    const pathname = router?.pathname;
    const segments = pathname?.split('/')?.filter(Boolean);
    
    const breadcrumbMap = {
      'dashboard': { label: 'Dashboard', path: '/dashboard' },
      'client-management': { label: 'Clientes', path: '/client-management' },
      'client-service-history': { label: 'Histórico de Serviços', path: '/client-service-history' },
      'product-inventory': { label: 'Produtos', path: '/product-inventory' },
      'service-visit-workflow': { label: 'Visitas', path: '/service-visit-workflow' }
    };

    const breadcrumbs = [{ label: 'Início', path: '/dashboard' }];
    
    segments?.forEach((segment, index) => {
      if (breadcrumbMap?.[segment]) {
        const isLast = index === segments?.length - 1;
        breadcrumbs?.push({
          ...breadcrumbMap?.[segment],
          path: isLast ? null : breadcrumbMap?.[segment]?.path
        });
      }
    });

    return breadcrumbs?.length > 1 ? breadcrumbs : [];
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems?.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems?.map((item, index) => {
          const isLast = index === breadcrumbItems?.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="mx-2 text-muted-foreground" 
                />
              )}
              {isLast ? (
                <span className="text-text-primary font-medium">
                  {item?.label}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  className="h-auto p-1 text-text-secondary hover:text-text-primary transition-smooth"
                >
                  {item?.label}
                </Button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;