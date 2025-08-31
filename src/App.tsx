
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";

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
import { lazy, Suspense } from "react";
import PageLoader from "@/components/common/PageLoader";
const Home = lazy(() => import("@/pages/Home"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Customer Pages
const RestaurantsPage = lazy(() => import("@/pages/customer/RestaurantsPage"));
const RestaurantDetailPage = lazy(() => import("@/pages/customer/RestaurantDetailPage"));
const CartPage = lazy(() => import("@/pages/customer/CartPage"));
const OrdersPage = lazy(() => import("@/pages/customer/OrdersPage"));
const ProfilePage = lazy(() => import("@/pages/customer/ProfilePage"));

// Vendor Pages
const VendorDashboard = lazy(() => import("@/pages/vendor/VendorDashboard"));
const VendorOrders = lazy(() => import("@/pages/vendor/VendorOrders"));
const VendorRestaurants = lazy(() => import("@/pages/vendor/VendorRestaurants"));
const VendorMenuPage = lazy(() => import("@/pages/vendor/VendorMenuPage"));
const VendorAvailabilityRequestsPage = lazy(() => import("@/pages/vendor/VendorAvailabilityRequestsPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const VendorApprovals = lazy(() => import("@/pages/admin/VendorApprovals"));
const TermsAndConditions = lazy(() => import("@/pages/admin/TermsAndConditions"));
const Legal = lazy(() => import("@/pages/Legal"));
const ReportIssue = lazy(() => import("@/pages/ReportIssue"));
const FssaiGuide = lazy(() => import("@/pages/FssaiGuide"));
import AnimatedLayout from "@/components/common/AnimatedLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <LocationProvider>
                <RestaurantProvider>
                  <OrderProvider>
                    <Toaster />
                    <Sonner />
                    <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes animate at top-level */}
                      <Route element={<AnimatedLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/fssai-guide" element={<FssaiGuide />} />
                        <Route path="/report-issue" element={<ReportIssue />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>

                      {/* App shells (their contents animate within the layout) */}
                      <Route path="/customer" element={<CustomerLayout />}>
                        <Route path="restaurants" element={<RestaurantsPage />} />
                        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                      </Route>

                      <Route path="/vendor" element={<VendorLayout />}>
                        <Route path="dashboard" element={<VendorDashboard />} />
                        <Route path="orders" element={<VendorOrders />} />
                        <Route path="restaurants" element={<VendorRestaurants />} />
                        <Route path="menu" element={<VendorMenuPage />} />
                        <Route path="availability-requests" element={<VendorAvailabilityRequestsPage />} />
                      </Route>

                      <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="vendors" element={<VendorApprovals />} />
                        <Route path="terms" element={<TermsAndConditions />} />
                      </Route>
                    </Routes>
                    </Suspense>
                  </OrderProvider>
                </RestaurantProvider>
              </LocationProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
