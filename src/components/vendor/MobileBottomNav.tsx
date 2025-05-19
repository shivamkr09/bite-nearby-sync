
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Menu as MenuIcon, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-6 md:hidden z-50">
      <div className="flex justify-between items-center">
        <Link 
          to="/vendor/dashboard" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/vendor/dashboard") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/vendor/orders" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/vendor/orders") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ShoppingBag className="h-5 w-5 mb-1" />
          <span>Orders</span>
        </Link>
        
        <Link 
          to="/vendor/menu" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/vendor/menu") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MenuIcon className="h-5 w-5 mb-1" />
          <span>Menu</span>
        </Link>
        
        <Link 
          to="/vendor/restaurants" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/vendor/restaurants") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span>Restaurants</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
