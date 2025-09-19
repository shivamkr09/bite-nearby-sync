import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, TrendingUp, Shield, Award, ChefHat, Users, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignInForm from "@/components/auth/SignInForm";
import { GradientMesh, FloatingParticles, GlassCard } from "@/components/ui/animated-backgrounds";

const RestaurantLogin = () => {
  const businessFeatures = [
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track orders, revenue, and customer insights in real-time"
    },
    {
      icon: Clock,
      title: "Order Management",
      description: "Efficiently manage incoming orders and update availability"
    },
    {
      icon: Users,
      title: "Customer Reach",
      description: "Connect with thousands of nearby customers instantly"
    }
  ];

  const stats = [
    { number: "500+", label: "Partner Restaurants", icon: Building2 },
    { number: "₹2.5M+", label: "Monthly Revenue", icon: TrendingUp },
    { number: "50K+", label: "Orders Processed", icon: ChefHat },
    { number: "99.9%", label: "Uptime", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Owner, Spice Garden",
      content: "BiteNearby has transformed our business. We've seen a 40% increase in orders since joining the platform.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      restaurant: "Spice Garden Restaurant"
    },
    {
      name: "Priya Sharma",
      role: "Manager, Delhi Delights",
      content: "The real-time availability feature helps us manage our kitchen efficiently. Customer satisfaction has improved significantly.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      restaurant: "Delhi Delights"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <GradientMesh />
      <FloatingParticles />
      
      {/* Navigation */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/" className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Bite<span className="text-foreground">Nearby</span>
          </Link>
          <Link to="/signin">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/5 hover:bg-white/10">
              Customer Login
            </Button>
          </Link>
        </div>
      </motion.header>

      <div className="flex min-h-screen pt-20">
        {/* Left Side - Business Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg space-y-8 relative z-10"
          >
            {/* Business Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">Restaurant Partner Portal</div>
                <div className="text-xs text-muted-foreground">Grow your business with BiteNearby</div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Grow your restaurant with
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Smart Technology
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Join hundreds of successful restaurants using our platform to increase orders, 
                manage operations efficiently, and connect with thousands of nearby customers.
              </motion.p>
            </div>

            {/* Business Features */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {businessFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Business Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-8"
            >
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                Platform Success Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 text-center"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                      <div className="font-bold text-lg">{stat.number}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                What Restaurant Owners Say
              </h3>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{testimonial.name}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 italic">"{testimonial.content}"</p>
                      <div className="text-xs text-emerald-600 font-medium">{testimonial.restaurant}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Restaurant Login</h2>
                <p className="text-muted-foreground">
                  Access your restaurant dashboard and manage your business
                </p>
              </motion.div>

              {/* Business Benefits Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/20"
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-sm">Business Success</div>
                    <div className="text-xs text-muted-foreground">Join 500+ successful restaurant partners</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <SignInForm />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-white/10 text-center"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  New to BiteNearby?{" "}
                  <Link 
                    to="/signup" 
                    className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
                  >
                    Register your restaurant
                  </Link>
                </p>
                
                <div className="text-xs text-muted-foreground">
                  By logging in, you agree to our{" "}
                  <Link to="/legal" className="text-emerald-600 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/legal" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-6 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span>Growth Focused</span>
                  </div>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <motion.div 
        className="lg:hidden absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <ChefHat className="w-24 h-24 mx-auto mb-4 text-emerald-600" />
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Restaurant Portal
            </span>
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default RestaurantLogin;