
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Menu, User, ShieldCheck, Users, Store, Bell, FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AdminLayout = () => {
  const { user, signOut, userType } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verify admin permission
  useEffect(() => {
    if (userType && userType !== 'admin') {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin area."
      });
      navigate('/signin');
    }
  }, [userType, navigate, toast]);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <ShieldCheck className="h-4 w-4 mr-2" /> },
    { label: "Vendors", path: "/admin/vendors", icon: <Store className="h-4 w-4 mr-2" /> },
    { label: "Users", path: "/admin/users", icon: <Users className="h-4 w-4 mr-2" /> },
    { label: "Orders", path: "/admin/orders", icon: <Bell className="h-4 w-4 mr-2" /> },
    { label: "Support Tickets", path: "/admin/support", icon: <Bell className="h-4 w-4 mr-2" /> },
    { label: "Terms & Conditions", path: "/admin/terms", icon: <FileText className="h-4 w-4 mr-2" /> },
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
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mb-6">
                  <SheetTitle>Admin Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 py-4 border-b">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Administrator</p>
                        </div>
                      </div>
                      
                      <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              `py-2 px-4 rounded-md flex items-center ${
                                isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                              }`
                            }
                            onClick={closeMenu}
                          >
                            {item.icon}
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

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
