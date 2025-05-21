
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useOrder } from '@/contexts/order/OrderContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cart } = useOrder();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          to="/customer/cart" 
          className={cn(
            "flex flex-col items-center text-xs p-1 relative", 
            isActive("/customer/cart") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span>Cart</span>
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
