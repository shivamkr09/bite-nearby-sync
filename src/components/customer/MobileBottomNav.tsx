
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, User } from 'lucide-react';
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
          to="/customer/restaurants" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/customer/restaurants") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/customer/map" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/customer/map") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MapPin className="h-5 w-5 mb-1" />
          <span>Nearby</span>
        </Link>
        
        <Link 
          to="/customer/orders" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/customer/orders") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ShoppingBag className="h-5 w-5 mb-1" />
          <span>Orders</span>
        </Link>
        
        <Link 
          to="/customer/profile" 
          className={cn(
            "flex flex-col items-center text-xs p-1", 
            isActive("/customer/profile") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <User className="h-5 w-5 mb-1" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
