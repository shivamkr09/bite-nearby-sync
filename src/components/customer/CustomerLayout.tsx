
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Menu, ShoppingCart, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrder } from "@/contexts/OrderContext";
import { useState } from "react";
import ThemeToggle from "../common/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomNav from "./MobileBottomNav";

const CustomerLayout = () => {
  const { user, signOut } = useAuth();
  const { cart } = useOrder();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "Restaurants", path: "/customer/restaurants" },
    { label: "My Orders", path: "/customer/orders" },
    { label: "Profile", path: "/customer/profile" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-xl text-primary">
              Bite<span className="text-foreground">Nearby</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {/* Show cart icon in header for all screens */}
            <Link to="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 py-4 border-b">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Customer</p>
                        </div>
                      </div>
                      
                      <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              `py-2 px-4 rounded-md ${
                                isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                              }`
                            }
                            onClick={closeMenu}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </nav>
                      
                      <div className="pt-4 mt-auto">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            signOut();
                            closeMenu();
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate("/signin");
                          closeMenu();
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate("/signup");
                          closeMenu();
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content - add padding at bottom for mobile navigation */}
      <main className="flex-1 container mx-auto px-4 pb-20 md:pb-8">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default CustomerLayout;
