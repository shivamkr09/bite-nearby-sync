
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Shield, Gift, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SignUpForm from "@/components/auth/SignUpForm";
import { GradientMesh, FloatingParticles, GlassCard } from "@/components/ui/animated-backgrounds";
import { mobileSpacingClasses, mobileButtonClasses } from "@/lib/mobile-optimizations";

const SignUp = () => {
  const benefits = [
    {
      icon: Users,
      title: "Join 10,000+ Users",
      description: "Be part of our growing community of food lovers"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your personal information is safe with us"
    },
    {
      icon: Gift,
      title: "Welcome Bonus",
      description: "Get ₹100 off on your first order"
    }
  ];

  const steps = [
    { id: 1, title: "Create Account", description: "Basic information" },
    { id: 2, title: "Verify Email", description: "Secure your account" },
    { id: 3, title: "Setup Profile", description: "Personalize experience" },
    { id: 4, title: "Start Ordering", description: "Discover restaurants" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      comment: "Best food delivery app! Real-time availability is amazing.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Rahul Kumar",
      comment: "Super fast delivery and great restaurant selection.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
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
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className={`${mobileButtonClasses.small} hover:bg-white/10 text-xs sm:text-sm`}>
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to</span> Home
            </Button>
          </Link>
          <Link to="/" className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Bite<span className="text-foreground">Nearby</span>
          </Link>
          <Link to="/signin">
            <Button variant="outline" size="sm" className={`${mobileButtonClasses.small} border-white/20 bg-white/5 hover:bg-white/10 text-xs sm:text-sm`}>
              Sign In
            </Button>
          </Link>
        </div>
      </motion.header>

      <div className="flex min-h-screen pt-16 sm:pt-20">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg space-y-8 relative z-10"
          >
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary border-primary/20 mb-4">
                <Gift className="w-4 h-4 mr-2" />
                Limited Time Offer
              </Badge>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Start your food journey with
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  BiteNearby
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Join thousands of food lovers who discover amazing restaurants, 
                check real-time availability, and enjoy hassle-free ordering.
              </motion.p>
            </div>

            {/* Benefits */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/20 to-purple-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-8"
            >
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                Getting Started is Easy
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {step.id}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="space-y-3"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{testimonial.name}</span>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.comment}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <GlassCard className={`${mobileSpacingClasses.container}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-6 sm:mb-8 lg:hidden"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Account</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Join BiteNearby and start discovering amazing food
                </p>
              </motion.div>

              {/* Special Offer Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm">Welcome Offer!</div>
                    <div className="text-xs text-muted-foreground">Get ₹100 off on your first order</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <SignUpForm />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center"
              >
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link 
                    to="/signin" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>4.9 Rating</span>
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
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BiteNearby
            </span>
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
