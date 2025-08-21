
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layouts
import CustomerLayout from "@/components/customer/CustomerLayout";
import VendorLayout from "@/components/vendor/VendorLayout";
import AdminLayout from "@/components/admin/AdminLayout";

// Pages
import Home from "@/pages/Home";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";

// Customer Pages
import RestaurantsPage from "@/pages/customer/RestaurantsPage";
import RestaurantDetailPage from "@/pages/customer/RestaurantDetailPage";
import CartPage from "@/pages/customer/CartPage";
import OrdersPage from "@/pages/customer/OrdersPage";
import ProfilePage from "@/pages/customer/ProfilePage";

// Vendor Pages
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import VendorOrders from "@/pages/vendor/VendorOrders";
import VendorRestaurants from "@/pages/vendor/VendorRestaurants";
import VendorMenuPage from "@/pages/vendor/VendorMenuPage";
import VendorAvailabilityRequestsPage from "@/pages/vendor/VendorAvailabilityRequestsPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import VendorApprovals from "@/pages/admin/VendorApprovals";

import TermsAndConditions from "@/pages/admin/TermsAndConditions";
import Legal from "@/pages/Legal";
import ReportIssue from "@/pages/ReportIssue";
import FssaiGuide from "@/pages/FssaiGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <LocationProvider>
              <RestaurantProvider>
                <OrderProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/fssai-guide" element={<FssaiGuide />} />
                    <Route path="/report-issue" element={<ReportIssue />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* Customer Routes */}
                    <Route path="/customer" element={<CustomerLayout />}>
                      <Route path="restaurants" element={<RestaurantsPage />} />
                      <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                    
                    {/* Vendor Routes */}
                    <Route path="/vendor" element={<VendorLayout />}>
                      <Route path="dashboard" element={<VendorDashboard />} />
                      <Route path="orders" element={<VendorOrders />} />
                      <Route path="restaurants" element={<VendorRestaurants />} />
                      <Route path="menu" element={<VendorMenuPage />} />
                      <Route path="availability-requests" element={<VendorAvailabilityRequestsPage />} />
                    </Route>
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="vendors" element={<VendorApprovals />} />
                      <Route path="terms" element={<TermsAndConditions />} />
                    </Route>
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </OrderProvider>
              </RestaurantProvider>
            </LocationProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
